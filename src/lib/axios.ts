import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (typeof window !== "undefined") {
      if (status === 401) {
        window.location.href = "/sign-in";
      } else if (status === 403) {
        window.location.href = "/forbidden";
      }
    }

    return Promise.reject(error);
  },
);