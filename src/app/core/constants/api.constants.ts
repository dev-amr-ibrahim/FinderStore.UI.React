import { environment } from '../../../environments/environment';
const baseUrl = environment.apiUrl;

export const ApiConstants = {
    BaseUrl: baseUrl,
    Login: 'auth/login',
    Register: 'auth/register',
    UpdateProfile: 'auth/update-profile',
    GetUserProfile: 'auth/GetUserProfile',
    Refresh: 'auth/refresh',
    Logout: 'auth/logout',
    Products: 'products',
    createProduct: 'admin/products',
} as const;
