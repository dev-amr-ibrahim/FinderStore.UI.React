export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: LoginUserDto;
}

export interface LoginUserDto {
    id: number;
    name: string;
    email: string;
    role: string;
}