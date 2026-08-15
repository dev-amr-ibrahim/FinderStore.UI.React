import axios, { type AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';

const baseUrl = environment.apiUrl;

export const apiService = {
  get: async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.get<T>(`${baseUrl}/${path}`, config);
    return response.data;
  },

  post: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.post<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  put: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.put<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  patch: async <T>(path: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.patch<T>(`${baseUrl}/${path}`, body, config);
    return response.data;
  },

  delete: async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.delete<T>(`${baseUrl}/${path}`, config);
    return response.data;
  }
};
