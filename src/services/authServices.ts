import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { signOut } from "firebase/auth";

const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const isLocalHost =
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
  const localFallback = "http://localhost:5000/api";

  if (isLocalHost) {
    return localFallback;
  }
  if (!apiUrl) {
    const fallback = "http://localhost:5000/api";
    console.warn(
      "VITE_API_URL is not defined. Falling back to",
      fallback,
      "for local development.",
    );
    return fallback;
  }
  return apiUrl;
};

const API_URL = getApiUrl();

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const loginUser = (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const signupUser = (data: any) => {
  return axios.post(`${API_URL}/auth/signup`, data);
};

export const verifyOTP = (data: { email: string; otp: string }) => {
  return axios.post(`${API_URL}/auth/verify-otp`, data);
};

export const resendOTP = (email: string) => {
  return axios.post(`${API_URL}/auth/resend-otp`, {
    email,
  });
};

export const logoutUser = () => {
  return axios.post(`${API_URL}/auth/logout`, {}, getAuthHeader());
};

export const getCurrentUser = () => {
  return axios.get(`${API_URL}/auth/me`, getAuthHeader());
};

export const uploadProfileImage = (formData: FormData) => {
  return axios.post(`${API_URL}/auth/upload-profile`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginWithGoogle = async () => {
  await signOut(auth);
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const firebaseUser = result.user;

    const idToken = await firebaseUser.getIdToken();

    const response = await axios.post(
      `${API_URL}/auth/google`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};
export const employeeLogin = (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/employee-login`, data);
};

export const getCalendarAttendance = () =>
  axios.get(`${API_URL}/attendance/calendar`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
