import axios from 'axios';
import Cookies from "universal-cookie";
const cookies = new Cookies();

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = cookies.get("LOGIN-COOKIE");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    viewUser: () => API.get('/auth/profile'),
    updateUser: (newData) => API.put('/auth/profile', newData),
    deleteUser: () => API.delete('/auth/profile'),
    getJitsiToken: (data) => API.post('/jitsi', data)
};