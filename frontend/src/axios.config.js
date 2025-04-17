// src/axios.config.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Base URL for your backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if you're using cookies or auth sessions
});

export default instance;
