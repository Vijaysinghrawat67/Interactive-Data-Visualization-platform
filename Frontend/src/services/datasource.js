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


const uploadText = ({name, text}) => {
    return api.post("/api/v1/upload/upload-text", 
      {name, text}, {
      withCredentials: true
    });
};


const uploadApi = ({name, apiUrl}) => {
  return api.post("/api/v1/upload/upload-api",
     {name, apiUrl},
      {withCredentials : true})
}

const getDataSourceSchema = async (dataSourceId) => {
  try {
    // Make a GET request to fetch the schema of the given data source
    const response = await api.get(`/api/v1/upload/${dataSourceId}/schema`, {
      withCredentials: true, // Make sure credentials are included
    });
    
    // Return the schema data received from the backend
    return response.data;
  } catch (error) {
    // Log the error and throw a more specific error message
    console.error("Error fetching data source schema:", error);
    throw new Error("Failed to fetch data source schema");
  }
};


const deleteDataSource = async (dataSourceId) => {
  try {
    const response = await api.delete(`/api/v1/upload/data-sources/${dataSourceId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete data source:", error);
    throw new Error("Delete failed");
  }
};

export{
  uploadCsvOrExcel,
  uploadText,
  uploadApi,
  getDataSourceSchema,
  deleteDataSource
}