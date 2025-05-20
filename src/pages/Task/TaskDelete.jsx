import axios from "axios";

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
};
