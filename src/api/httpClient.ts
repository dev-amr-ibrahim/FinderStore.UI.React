import axios, { type AxiosInstance } from "axios";

import registerRequestInterceptor from "./interceptors/requestInterceptor";
import registerResponseInterceptor from "./interceptors/responseInterceptor";

const BASE_API_URL = import.meta.env.VITE_API_URL;

const httpClient: AxiosInstance = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    headers: {
        "Accept": "application/json"
    }
});

// Request Interceptor
registerRequestInterceptor(httpClient);

// Response Interceptor
registerResponseInterceptor(httpClient);

export default httpClient;