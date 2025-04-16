/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const registerUser = (data: any) => API.post("/register", data);
export const loginUser = (data: any) => API.post("/login", data);
