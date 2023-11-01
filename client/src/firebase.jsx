// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "usekape-8448e.firebaseapp.com",
  projectId: "usekape-8448e",
  storageBucket: "usekape-8448e.appspot.com",
  messagingSenderId: "744154645753",
  appId: "1:744154645753:web:f626bf01ff4a0191988e28"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);