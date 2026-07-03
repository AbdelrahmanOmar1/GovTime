import axios from 'axios';

const api = axios.create({
  baseURL: 'govtime-production.up.railway.app/api/v1/', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
