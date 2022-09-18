import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router, user]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
