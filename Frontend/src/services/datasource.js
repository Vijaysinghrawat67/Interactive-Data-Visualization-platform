import api from "./axios.js"; // Axios instance with base URL and JWT auth

export const getDataSources = async () => {
  try {
    const response = await api.get("/api/v1/upload/data-sources", {
      withCredentials : true,
    });
    //console.log("axios response", response)
    return response.data;

  } catch (error) {
    console.error("Failed to fetch data sources", error);
    throw error;
  }
};

export const getSingleDataSource = async (id) => {
  try {
    const response = await api.get(`/api/v1/upload/data-sources/${id}`, {
      withCredentials : true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching single data source:", error);
    throw error;
  }
}

const uploadCsvOrExcel  = (formdata) => {
  return api.post("/api/v1/upload/upload-file", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials : true,
  });
};


const uploadTest = (text) => {
    return api.post("/api/v1/upload/upload-text", {text}, {
      withCredentials: true
    });
};


const uploadApi = (url) => {
  return api.post("/api/v1/upload/upload-api", {url}, {withCredentials : true})
}

export{
  uploadCsvOrExcel,
  uploadTest,
  uploadApi
}