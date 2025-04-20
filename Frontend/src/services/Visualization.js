import api from "./axios.js";

const createVisualization = (data) => 
    api.post("/api/v1/visualization/", data);


const getUserVisualization = () => 
    api.get("/api/v1/visualization/");

const getSharedVisualization = () => 
    api.get("/api/v1/visualization/shared-with-me");


const getVisualizationById = (id) => 
    api.get(`/api/v1/visualization/${id}` );


const updateVisualization = (id, data) =>
    api.put(`/api/v1/visualization/${id}`, data);


const deleteVisualization = (id) => 
    api.delete(`/api/v1/visualization/${id}`);


export {
    createVisualization,
    getUserVisualization,
    getSharedVisualization,
    getVisualizationById,
    updateVisualization,
    deleteVisualization
}