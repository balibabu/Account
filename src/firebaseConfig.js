// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Import Auth tools
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt4Z0ga2v2mod-m22Jgb0fmZpG89Xm_fU",
  authDomain: "account-538ab.firebaseapp.com",
  projectId: "account-538ab",
  storageBucket: "account-538ab.firebasestorage.app",
  messagingSenderId: "569938791806",
  appId: "1:569938791806:web:76dab4a145fce09873372f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with Persistence (Keeps user logged in)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);