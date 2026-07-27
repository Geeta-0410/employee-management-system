// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWu22bffefPU0rUjJJwNWGEYJzyhb6QWg",
  authDomain: "employee-management-7c15f.firebaseapp.com",
  projectId: "employee-management-7c15f",
  storageBucket: "employee-management-7c15f.firebasestorage.app",
  messagingSenderId: "487580774800",
  appId: "1:487580774800:web:ef49b68a078f8df9d98315"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;