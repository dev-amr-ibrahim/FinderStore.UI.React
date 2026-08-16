const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const Storage = {
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    setRefreshToken: (token: string) => {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },
    removeRefreshToken: () => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};