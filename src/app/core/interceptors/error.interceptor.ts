import { authService } from '../services/auth.service';

export const errorInterceptor = {
  response: (error: any) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Session expired. Please login again.';
          authService.logout();
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = error.response.data?.message || `Error ${error.status}: ${error.statusText}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from server.';
    }

    return Promise.reject({ ...error, errorMessage });
  }
};
