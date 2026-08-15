import { authService } from '../services/auth.service';

export const authInterceptor = {
  request: (config: any) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  response: (error: any) => {
    return Promise.reject(error);
  }
};
