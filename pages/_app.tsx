import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import AuthWrapper from '../components/AuthWrapper';
import { Navbar } from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { store } from '../redux/store';

const noAuthRequired = ['/', '/login', '/signup'];
const persistor = persistStore(store);
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navbar />
        <AuthWrapper>
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </AuthWrapper>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
