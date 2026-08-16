import  {type AxiosInstance,type InternalAxiosRequestConfig } from "axios";
import { Storage } from "../../utils/storage";

 const registerRequestInterceptor = (httpClient: AxiosInstance) =>  {
     httpClient.interceptors.request.use(
         (config: InternalAxiosRequestConfig) => {
             const token = Storage.getToken();
             if (token) {
                 config.headers["Authorization"] = `Bearer ${token}`;
            }
             return config;
         }
     );
 }

 export default registerRequestInterceptor;
