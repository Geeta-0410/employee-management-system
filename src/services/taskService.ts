import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTasks = () => {
  return axios.get(`${API_URL}/tasks`, getAuthHeader());
};

export const addTask = (data: any) => {
  return axios.post(`${API_URL}/tasks`, data, getAuthHeader());
};

export const updateTask = (id: string, data: any) => {
  return axios.put(`${API_URL}/tasks/${id}`, data, getAuthHeader());
};

export const deleteTask = (id: string) => {
  return axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
};
