import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

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

export const updateTagSpent = async (userId, tagId, newSpent) => {
  let result = null;
  let error = null;

  try {
    const tagDocRef = doc(db, "users", userId, "tag", tagId);
    const tagDoc = await getDoc(tagDocRef);

    if (tagDoc.exists()) {
      const currentData = tagDoc.data();
      const currentSpent = currentData.spent || 0;
      const updatedSpent = currentSpent + newSpent;

      result = await updateDoc(tagDocRef, { spent: updatedSpent });
      console.log("Tag spent data updated successfully");
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    error = e;
    console.error("Error updating tag spent data: ", error);
  }

  return { result, error };
};
