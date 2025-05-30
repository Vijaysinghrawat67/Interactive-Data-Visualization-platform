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

const deleteExport = async(exportId) => {
    return await api.delete(`/api/v1/export/delete/${exportId}`);
}


const getActivityLogs = async(params = {}) => {
    const response = await api.get("/api/v1/activity", {
        params,
    });
    return response.data;
}

export{
    saveExport,
    getAllExports,
    downloadExport,
    deleteExport,
    getActivityLogs
}