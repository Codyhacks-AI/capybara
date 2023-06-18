import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:5000/";

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const requests = {
  get: async (url: string) => {
    const res = await instance.get(url);
    return responseBody(res);
  },
  post: async (url: string, body: {}) => {
    const res = await instance.post(url, body);
    return responseBody(res);
  },
  put: async (url: string, body: {}) => {
    const res = await instance.put(url, body);
    return responseBody(res);
  },
  delete: async (url: string) => {
    const res = await instance.delete(url);
    return responseBody(res);
  },
};
