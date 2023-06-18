import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:5000/";

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const body_response = <T>(response: AxiosResponse<T>) => response.data;

export const RequestINFOforDoGs = {
  get: async (url: string) => {
    const res = await instance.get(url);
    return body_response(res);
  },
  post: async (url: string, body: {}) => {
    const res = await instance.post(url, body);
    return body_response(res);
  },
  put: async (url: string, body: {}) => {
    const res = await instance.put(url, body);
    return body_response(res);
  },
  delete: async (url: string) => {
    const res = await instance.delete(url);
    return body_response(res);
  },
};
