import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../lib/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const addNewTask = async (task: Task) => {
    const newTask = await createTask(task);
    setTasks((prev) => [...prev, newTask]);
  };

  const editTask = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const removeTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, addNewTask, editTask, removeTask, reload: loadTasks };
};
