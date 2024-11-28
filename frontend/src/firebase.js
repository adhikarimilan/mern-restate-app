// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "restate-2cfb7.firebaseapp.com",
  projectId: "restate-2cfb7",
  storageBucket: "restate-2cfb7.firebasestorage.app",
  messagingSenderId: "531639502596",
  appId: "1:531639502596:web:daac562a6799a62f9cb251",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
