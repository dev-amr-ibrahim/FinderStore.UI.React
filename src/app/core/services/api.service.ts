import axios, { type AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';
import httpClient from "../../../api/httpClient";
const baseUrl = environment.apiUrl;

export const apiService = {
  get: async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.get<T>(`${baseUrl}/${path}`, config);
    return response.data;
  },

  post: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.post<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  put: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.put<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  patch: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.patch<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  delete: async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.delete<T>(`${baseUrl}/${path}`, config);
    return response.data;
  }
};
