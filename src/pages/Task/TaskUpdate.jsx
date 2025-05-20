
import axios from "axios";

export const updateTask = async (id, updatedData) => {
  try {
    const response = await axios.put(`/api/tasks/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
};