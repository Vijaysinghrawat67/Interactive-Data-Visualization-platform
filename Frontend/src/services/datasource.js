import api from "./axios.js"; // Axios instance with base URL and JWT auth

export const getDataSources = async () => {
  try {
    const response = await api.get("api/v1/upload/data-sources");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data sources", error);
    throw error;
  }
};
