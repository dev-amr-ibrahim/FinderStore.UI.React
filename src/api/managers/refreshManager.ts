
import type { RetryRequestConfig } from "../interceptors/responseInterceptor";
import axios, { type AxiosError, type AxiosInstance } from "axios";
import { Storage } from "../../utils/storage";
import type { RefreshResponse } from "../../models/RefreshResponse";

const BASE_API_URL = import.meta.env.VITE_API_URL;
let isRefreshing = false;
type FailedRequest = {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
};

let failedQueue: FailedRequest[] = [];

export const refreshManager = {

    refreshRequest: async (originalRequest: RetryRequestConfig, httpClient: AxiosInstance, error: any) => {

        if (isRefreshing) {

            return new Promise((resolve, reject) => {

                failedQueue.push({
                    resolve,
                    reject
                });

            }).then(() => {
                // originalRequest.headers.Authorization =
                //     `Bearer ${token}`;

                return httpClient(originalRequest);
            });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {

            const refreshToken = Storage.getRefreshToken();
            const accessToken = Storage.getToken();

            if (!refreshToken || !accessToken) {
                return Promise.reject(error);
            }

            const response = await axios.post<RefreshResponse>(`${BASE_API_URL}auth/refresh`,
                {
                    refreshToken,
                    accessToken
                });

            console.log("Refresh Token Response: => ", response);

            Storage.setRefreshToken(response.data.refreshToken);
            Storage.setToken(response.data.accessToken);

            processQueue(null, response.data.accessToken);

            return httpClient(originalRequest);

        }
        catch (refreshError) {
            console.log("Refresh Failed");
            Storage.removeRefreshToken();
            Storage.removeToken();
            processQueue(refreshError as AxiosError);
            return Promise.reject(refreshError);
        }
        finally {
            isRefreshing = false;
        }
        function processQueue(error: AxiosError | null, token?: string) {

            failedQueue.forEach(({ resolve, reject }) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(token!);
                }
            });
            
            failedQueue = [];
        }
    }    
}