import { getDocs, collection } from "firebase/firestore";
import { db } from "../config";

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
