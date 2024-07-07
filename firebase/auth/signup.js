import firebase_app from "../config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(email, password) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    // Optionally, redirect the user to the login page or perform other actions
  } catch (error) {
    console.log("Error signing out:", error.message);
  }
};
