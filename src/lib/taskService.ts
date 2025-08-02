import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
} from "firebase/firestore";
import type { TaskInput } from "./types";

const tasksRef = collection(db, "tasks");

export const createTask = async (task: TaskInput) => {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return { id: docRef.id, ...task };
};

export const getTasks = async () => {
  const q = query(collection(db, "tasks"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[]; // optionally define proper typing here
};

export const updateTask = async (
  id: string,
  updatedTask: Partial<TaskInput>
) => {
  const docRef = doc(db, "tasks", id);
  await updateDoc(docRef, updatedTask);
};

export const deleteTask = async (id: string) => {
  const docRef = doc(db, "tasks", id);
  await deleteDoc(docRef);
  // reload page
  window.location.reload();
};
