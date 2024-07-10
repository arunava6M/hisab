// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyAnUQBCLWxgEXiRAmc5F3o6PUG3S1R93yg",
  authDomain: "hisab-2e9e8.firebaseapp.com",
  projectId: "hisab-2e9e8",
  storageBucket: "hisab-2e9e8.appspot.com",
  messagingSenderId: "552249536743",
  appId: "1:552249536743:web:2bf02e1f3abb0e24443242",
};
let firebase_app =
  getApps().length === 0 ? initializeApp(config) : getApps()[0];

export const db = getFirestore(firebase_app);
export default firebase_app;
