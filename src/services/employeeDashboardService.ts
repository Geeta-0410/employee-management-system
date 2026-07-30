import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getSkills = async () => {
  const response = await axios.get(`${API_URL}/employees/skills`, getAuthHeaders());

  return response;
};

export const addSkill = async (skillData: { name: string; level: number }) => {
  const response = await axios.post(
    `${API_URL}/employees/skills`,
    skillData,
    getAuthHeaders(),
  );

  return response;
};

export const updateSkill = async (
  skillId: string,
  skillData: {
    name: string;
    level: number;
  },
) => {
  const response = await axios.put(
    `${API_URL}/employees/skills/${skillId}`,
    skillData,
    getAuthHeaders(),
  );

  return response;
};

export const deleteSkill = async (skillId: string) => {
  const response = await axios.delete(
    `${API_URL}/employees/skills/${skillId}`,
    getAuthHeaders(),
  );

  return response;
};
