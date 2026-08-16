import { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { refreshManager } from "../managers/refreshManager";

export interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const registerResponseInterceptor = (httpClient: AxiosInstance) => {

    httpClient.interceptors.response.use(
        (response) => {
            return response;
        },

        async (error) => {

            const originalRequest = error.config as RetryRequestConfig;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            if (error.response?.status !== 401) {
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                return Promise.reject(error);
            }
            return await refreshManager.refreshRequest(originalRequest, httpClient, error);
        }
    );
}

export default registerResponseInterceptor;