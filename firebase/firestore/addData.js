import firebase_app from "../config";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function addSpentData(id, data) {
  let result = null;
  let error = null;

  try {
    const spentCollectionRef = collection(db, "users", id, "spent");
    result = await addDoc(collection(db, "users", id, "spent"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
