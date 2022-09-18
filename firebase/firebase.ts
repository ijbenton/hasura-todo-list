import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyA_HmYbBMgtvCYzTjhWfi_7pfaIvqpDRi0',
  authDomain: 'hasura-firebase-4bbf4.firebaseapp.com',
  projectId: 'hasura-firebase-4bbf4',
  databaseUrl: 'https://hasura-firebase-4bbf4-default-rtdb.firebaseio.com',
  storageBucket: 'hasura-firebase-4bbf4.appspot.com',
  messagingSenderId: '519289364948',
  appId: '1:519289364948:web:bad7d10a86d99385b67641'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
export { auth, database };
