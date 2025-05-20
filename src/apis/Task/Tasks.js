// 📁 TaskApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_KEY;

export const updateTask = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE}/tasks/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
};
