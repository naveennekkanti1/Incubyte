import axios from "axios";

const API = axios.create({
  baseURL: "https://incubyte-9rtg.onrender.com/api",
  withCredentials: true, // important if using cookies
});


// Attach token if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
