import { ApiConstants } from '../constants/api.constants';
import { apiService } from './api.service';
import type { ProfileDto } from '../models/profile-dto';

export class CustomerService {
  async getUserProfile() {
    return apiService.get<ProfileDto>(`${ApiConstants.GetUserProfile}`);
  }
}

export const customerService = new CustomerService();
