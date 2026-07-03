import axios from "axios";

const api = axios.create({
  baseURL: "https://govtime-production.up.railway.app/api/v1/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
