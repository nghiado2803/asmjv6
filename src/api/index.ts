import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("Lỗi kết nối Backend:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;