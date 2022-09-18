import { signInWithEmailAndPassword } from 'firebase/auth';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { auth } from '../firebase/firebase';
import { setUser } from '../redux/slices/authSlice';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="mx-auto md:w-8/12 lg:w-5/12">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email')
            .required('Email is required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            const { user } = await signInWithEmailAndPassword(
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
            router.push('/dashboard');
          } catch (error) {
            console.log(error);
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
          isSubmitting,
          isValid
        }) => (
          <Form className="block w-full text-center">
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
            <div className="mb-4">
              <input
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
              />
            </div>
            {errors.password && touched.password && errors.password}
            <div className="text-center pt-1 mb-1 pb-1">
              <button
                className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-blue-500 hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <div className="flex w-full justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  'Log in'
                )}
              </button>
            </div>
            <div className="text-center pt-1 mb-12 pb-1">
              <button
                className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-cyan-500 hover:bg-cyan-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                type="button"
                disabled={isSubmitting}
              >
                <Link href="/signup">
                  <a>Sign Up</a>
                </Link>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
