// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsfbjXJO8oenfYJpdqWbaVWWS4bAwVPoY",
  authDomain: "emporio-arcano.firebaseapp.com",
  projectId: "emporio-arcano",
  storageBucket: "emporio-arcano.firebasestorage.app",
  messagingSenderId: "175783071062",
  appId: "1:175783071062:web:cea902e951fb9f3aa81af7",
  measurementId: "G-4297FHDZKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);