import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCywWZCkgYwgRjWIsARGSMFict17DKxq6U',
  authDomain: 'maepui-ba064.firebaseapp.com',
  projectId: 'maepui-ba064',
  storageBucket: 'maepui-ba064.appspot.com',
  messagingSenderId: '1008857893770',
  appId: '1:1008857893770:web:91cef662b4c7d11826d673',
  measurementId: 'G-ZBLEQTMKEW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);
