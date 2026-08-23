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
    updateProduct: 'admin/products',
    createCategory: 'admin/catalog/categories',
    getCategoriesListLite: 'admin/catalog/categoriesLite',
    getCategories: 'admin/catalog/categories',
} as const;
