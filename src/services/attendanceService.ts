import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

export const markAttendance = (latitude: number, longitude: number) =>
  axios.post(
    `${API_URL}/attendance/mark`,
    { latitude, longitude },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

export const getMonthlyAttendance = () =>
  axios.get(`${API_URL}/attendance/monthly`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getCalendarAttendance = (month: number, year: number) =>
  axios.get(`${API_URL}/attendance/calendar?month=${month}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getTodayStatus = () =>
  axios.get(`${API_URL}/attendance/today-status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const checkIn = () =>
  axios.post(
    `${API_URL}/attendance/checkin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

export const checkOut = () =>
  axios.post(
    `${API_URL}/attendance/checkout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

export const getWorkHoursReport = () =>
  axios.get(`${API_URL}/attendance/work-hours-report`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
