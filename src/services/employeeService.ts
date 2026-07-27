import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFilterOptions = () => {
  return axios.get(`${API_URL}/employees/filter-options`, getAuthHeader());
};
export const getEmployees = (
  params: {
    search?: string;
    company?: string;
    domain?: string;
    page?: number;
    limit?: number;
  } = {},
) => {
  return axios.get(`${API_URL}/employees`, {
    ...getAuthHeader(),
    params: {
      search: params.search || "",
      company: params.company || "",
      domain: params.domain || "",
      page: params.page || 1,
      limit: params.limit || 4,
    },
  });
};
export const createEmployee = (data: any) => {
  return axios.post(`${API_URL}/employees`, data, getAuthHeader());
};
export const updateEmployee = (employeeId: number, data: any) => {
  return axios.put(`${API_URL}/employees/${employeeId}`, data, getAuthHeader());
};
export const deleteEmployee = (employeeId: number) => {
  return axios.delete(`${API_URL}/employees/${employeeId}`, getAuthHeader());
};
export const getEmployeeProfile = () => {
  return axios.get(`${API_URL}/employees/profile`, getAuthHeader());
};

export const updateEmployeeProfile = (formData: FormData) => {
  return axios.put(`${API_URL}/employees/profile/update`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
