import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const getMatrices = () => axios.get(`${API_BASE}/matrices`);
export const createMatrix = (data) => axios.post(`${API_BASE}/matrices`, data);
export const deleteMatrix = (id) => axios.delete(`${API_BASE}/matrices/${id}`);

export const getDrones = () => axios.get(`${API_BASE}/drones`);
export const createDrone = (data) => axios.post(`${API_BASE}/drones`, data);
export const updateDrone = (id, data) =>
  axios.put(`${API_BASE}/drones/${id}`, data);
export const executeCommands = (droneId, commands) =>
  axios.post(`${API_BASE}/flights/drones/${droneId}/commands`, { commands });
