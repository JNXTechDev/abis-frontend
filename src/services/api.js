import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: BASE,
  // Do not force a Content-Type here so multipart/form-data requests
  // (FormData) can set their own boundary header automatically.
  timeout: 5000,
});

export default api;
