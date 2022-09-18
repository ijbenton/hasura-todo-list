import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { selectUser } from '../redux/slices/authSlice';

const Home: NextPage = () => {
  const user = useSelector(selectUser);
  return (
    <div className="flex flex-1 w-full h-full justify-between flex-col">
      <Head>
        <title>Hasura Todos</title>
        <meta name="description" content="Hasura todo list application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center py-8 px-16">
        {user ? (
          <button
            type="button"
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            <Link href="/dashboard">
              <a>Click here to view your todos!</a>
            </Link>
          </button>
        ) : (
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello!</h1>
              <p className="py-6">Welcome to this wonderful todo app.</p>

              <div className="rounded-md shadow">
                <Link href="/signup">
                  <a className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg">
                    Get Started
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
