import axios from "axios";

const API = axios.create({
  baseURL: "https://privateenergyproviderassesment.onrender.com", // Or your FastAPI URL
});

export const registerUser = (data: any) => API.post("/register", data);
export const loginUser = (data: any) => API.post("/login", data);
