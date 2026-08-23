import axios from "axios";

const api = axios.create({
  baseURL: "https://shopsphere-9d8pto4d.b4a.run/api",
});
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
