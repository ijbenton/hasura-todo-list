import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import Spinner from '../components/common/Spinner';
import { auth } from '../firebase/firebase';
import { setUser } from '../redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="mx-auto md:w-8/12 lg:w-5/12">
      <Formik
        initialValues={{ email: '', password: '', passwordConfirmation: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
          password: Yup.string().required('Password is required'),
          passwordConfirmation: Yup.string()
            .required('Confirm password')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            console.log('firebase req');
            const { user } = await createUserWithEmailAndPassword(
              auth,
              values.email,
              values.password
            );
            const token = await user.getIdToken();
            dispatch(
              setUser({
                email: user.email as string,
                id: user.uid,
                displayName: user.email?.substring(
                  0,
                  user.email.indexOf('@')
                ) as string,
                accessToken: token
              })
            );
            router.push('/');
            setSubmitting(false);
          } catch (error) {
            console.log(error);
            alert(error);
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-4 mt-16 text-red-400">
              <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Email address"
              />
              {errors.email && touched.email && errors.email}
            </div>
            <div className="mb-4 text-red-400">
              <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="New Password"
              />
              {errors.password && touched.password && errors.password}
            </div>
            <div className="mb-4 text-red-400">
              <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="password"
                name="passwordConfirmation"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.passwordConfirmation}
                placeholder="Confirm Password"
              />
              {errors.passwordConfirmation &&
                touched.passwordConfirmation &&
                errors.passwordConfirmation}
            </div>
            <div className="text-center pt-1 mb-1 pb-1">
              <button
                className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md bg-blue-500 hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : 'Sign Up'}
              </button>
            </div>
            <div className="text-center pt-1 mb-12 pb-1">
              <button
                className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md bg-cyan-500 hover:bg-cyan-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                type="button"
              >
                <Link href="/login">
                  <a>Already have an account? Sign In</a>
                </Link>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
