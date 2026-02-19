// import axios from "axios";

// export const API_BASE_URL = "http://localhost:5454";
// // export const API_BASE_URL="ecommercebackend-production-5dab.up.railway.app"

// const jwt = localStorage.getItem("jwt");

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Authorization": `Bearer ${jwt}`,
//     "Content-Type": "application/json"
//   }
// });

import axios from "axios";

export const API_BASE_URL = "ecommercebackend-production-1487.up.railway.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔥 Attach token dynamically before every request
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
