import { ApiConstants } from '../constants/api.constants';
import { apiService } from './api.service';
import { storageService } from './storage.service';
import type { LoginResponse } from '../models/login-response';
import type { RegisterRequest } from '../models/register-request';
import type { UpdateProfileRequest } from '../models/update-profile-request';
import type { UserInfo } from '../models/user-info';
import type { RefreshRequest } from '../models/refresh-request';

class AuthServiceClass {
  private currentUser: any = null;
  private _isAuthenticated: boolean = false;
  private _isRefreshing: boolean = false;
  private refreshTokenSubject: string | null = null;

  constructor() {
    this.restoreSession();
  }

  async login(request: { email: string; password: string }) {
    const response = await apiService.post<LoginResponse>(
      `${ApiConstants.Login}`,
      request
    );
    this.saveSession(response);
    return response;
  }

  async register(request: RegisterRequest) {
    const response = await apiService.post<LoginResponse>(
      `${ApiConstants.Register}`,
      request
    );
    this.saveSession(response);
    return response;
  }

  async updateProfile(request: UpdateProfileRequest) {
    const user = await apiService.post<UserInfo>(
      `${ApiConstants.UpdateProfile}`,
      request
    );
    this.updateStoredUser(user);
    return user;
  }

  private saveSession(response: LoginResponse): void {
    storageService.set('authToken', response.accessToken);
    storageService.set('refreshToken', response.refreshToken);
    storageService.set('expires_at', response.expiresAt.toString());
    storageService.set('currentUser', JSON.stringify(response.user));
    this.currentUser = response.user;
    this._isAuthenticated = true;
  }

  private restoreSession(): void {
    if (!this.isLoggedIn()) return;
    const storedUser = storageService.get('currentUser');
    if (!storedUser) return;
    try {
      this.currentUser = JSON.parse(storedUser);
      this._isAuthenticated = true;
    } catch {
      storageService.remove('currentUser');
    }
  }

  private updateStoredUser(user: UserInfo): void {
    storageService.set('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  getAccessToken(): string | null {
    return storageService.get('authToken');
  }

  getExpiresAt(): string | null {
    return storageService.get('expires_at');
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getExpiresAt();
    if (!token || !expiresAt) return false;
    return new Date(expiresAt) > new Date();
  }

  async refreshToken(): Promise<LoginResponse> {
    const request: RefreshRequest = {
      accessToken: storageService.get('authToken')!,
      refreshToken: storageService.get('refreshToken')!
    };
    return apiService.post<LoginResponse>(
      `${ApiConstants.BaseUrl}${ApiConstants.Refresh}`,
      request
    );
  }

  logout(): void {
    storageService.remove('authToken');
    storageService.remove('refreshToken');
    storageService.remove('expires_at');
    storageService.remove('currentUser');
    this.currentUser = null;
    this._isAuthenticated = false;
  }
}

export const authService = new AuthServiceClass();
