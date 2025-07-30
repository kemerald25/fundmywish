
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your app's Firebase project configuration.
// You can get this from the Firebase console for your project.
// See: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyADZUr1k10og-c9lufNa5GBGNFfllfPwXY",
  authDomain: "devroyale-71fb3.firebaseapp.com",
  projectId: "devroyale-71fb3",
  storageBucket: "devroyale-71fb3.appspot.com",
  messagingSenderId: "475387028144",
  appId: "1:475387028144:web:98bda819740a6d3fb09175",
  measurementId: "G-JL6MFTXFGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
