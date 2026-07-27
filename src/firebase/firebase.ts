// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrBYf74SGVyA9lVaMro5Of2nGZEIAve1s",
  authDomain: "employee-management-b9381.firebaseapp.com",
  projectId: "employee-management-b9381",
  storageBucket: "employee-management-b9381.firebasestorage.app",
  messagingSenderId: "110796544786",
  appId: "1:110796544786:web:08ed70be6637c624f5f1cb",
  measurementId: "G-2Z4JEJHCLH"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;