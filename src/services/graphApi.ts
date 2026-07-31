import { msalInstance } from "@/auth/AuthProvider";
import { loginRequest } from "@/auth/authConfig";
import axios from "axios";

export const graphApi = axios.create({
  baseURL: "https://graph.microsoft.com/v1.0",
  headers: {
    "Content-Type": "application/json",
  },
});

graphApi.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) throw new Error("Usuário não autenticado");

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: accounts[0],
  });

  config.headers.Authorization = `Bearer ${response.accessToken}`;
  return config;
});

graphApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message ?? error.message;
    return Promise.reject(new Error(message));
  },
);
