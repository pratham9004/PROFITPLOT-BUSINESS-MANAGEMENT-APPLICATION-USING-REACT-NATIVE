import { initializeApp, getApps } from 'firebase/app';

import { 
  initializeAuth,
  getReactNativePersistence,
  updateProfile
} from 'firebase/auth';
import { getFirestore, writeBatch } from 'firebase/firestore';



import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBd_EZofvg2HG4nWx10HLU_Y5otrSaqYzY",
  authDomain: "profitplot-cb61e.firebaseapp.com",
  projectId: "profitplot-cb61e",
  storageBucket: "profitplot-cb61e.firebasestorage.app",
  messagingSenderId: "838036605044",
  appId: "1:838036605044:web:4231be1b27b3af5c312921"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


// Initialize authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// Initialize Firestore (db)
const db = getFirestore(app);

export { auth, db };
