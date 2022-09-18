import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { auth, database } from '../firebase/firebase';
import { setUser } from '../redux/slices/authSlice';
import Spinner from './common/Spinner';

interface Props {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user?.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims['https://hasura.io/jwt/claims'];

        if (hasuraClaim) {
          dispatch(
            setUser({
              email: user.email as string,
              id: user.uid,
              displayName:
                user.email?.substring(0, user.email.indexOf('@')) ?? 'user',
              accessToken: token
            })
          );
        } else {
          console.log('no hasura claim');
          // Check if refresh is required.
          const metadataRef = ref(database, `metadata/${user.uid}/refreshTime`);
          onValue(metadataRef, async (data) => {
            if (data.exists()) {
              // Force refresh to pick up the latest custom claims changes.
              const token = await user.getIdToken(true);
              console.log('set user', token);
              dispatch(
                setUser({
                  email: user.email as string,
                  id: user.uid,
                  displayName:
                    user.email?.substring(0, user.email.indexOf('@')) ?? 'user',
                  accessToken: token
                })
              );
            } else {
              console.log('data doesnt exist');
            }
          });
        }
      } else {
        dispatch(setUser(undefined));
      }

      setTimeout(() => setLoading(false), 1000);
      return () => unsubscribe();
    });
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Spinner color="black" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthWrapper;
