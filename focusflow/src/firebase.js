import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCfWOOi3kKifJPg85cUAnsv7TYGsCT_2aY",
    authDomain: "studytimer-4f469.firebaseapp.com",
    projectId: "studytimer-4f469",
    storageBucket: "studytimer-4f469.firebasestorage.app",
    messagingSenderId: "1070514591632",
    appId: "1:1070514591632:web:3324cd3278898385578515"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
