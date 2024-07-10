import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../config";

export default async function addSpentData(id, data) {
  let result = null;
  let error = null;

  try {
    result = await addDoc(collection(db, "users", id, "spent"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export const addTag = async (id, data) => {
  let result = null;
  let error = null;

  try {
    result = await addDoc(collection(db, "users", id, "tag"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
};
