import axios from "axios";

const apiReq = axios.create({
  // baseURL: 'http://localhost:8800/api',
  baseURL: "https://campusguard.onrender.com/api/",
  withCredentials: true,
});

export default apiReq;
