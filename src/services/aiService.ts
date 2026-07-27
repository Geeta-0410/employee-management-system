import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const sendChatMessage = (message: string) => {
  return axios.post(`${API_URL}/ai/chat`, { message }, getAuthHeader());
};
