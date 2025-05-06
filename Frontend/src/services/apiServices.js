import api from "./axios.js";


const saveExport = async(payload) => {
    const response = await api.post("/api/v1/export/save", payload);
    return response.data;
}

const getAllExports = async() => {
    const response = await api.get("/api/v1/export/list");
    return response.data;
}


const downloadExport = async(fileName) => {
    const response = await api.get(`/api/v1/export/download/${fileName}`, {
        responseType: 'blob', 

    });
    return response;
}

export{
    saveExport,
    getAllExports,
    downloadExport
}