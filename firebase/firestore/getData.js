import firebase_app from "../config";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function getSpentData(id) {
  const resultArray = [];
  let error = null;

  try {
    const spentCollectionSnapshot = await getDocs(
      collection(db, "users", id, "spent")
    );
    spentCollectionSnapshot.forEach((doc) => {
      resultArray.push(doc.data());
    });
  } catch (e) {
    error = e;
  }

  return { resultArray, error };
}
