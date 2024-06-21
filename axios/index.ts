import axios from "axios";

// Create an axios instance
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("auth");

    if (authToken) {
      config.headers["Authorization"] = `Token ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
