import { ApiConstants } from '../constants/api.constants';
import { apiService } from './api.service';
import type { CategoryLite } from '../models/categoryLite';
import type { CategoryDto } from '../models/categoryDto';
import type { CategoryUpsertRequest } from '../models/category-upsert-request';

export class CategoryService {
  getCategoriesListLite(): Promise<CategoryLite[]> {
    return apiService.get<CategoryLite[]>(ApiConstants.getCategoriesListLite);
  }

   getCategories(): Promise<CategoryDto[]> {
    return apiService.get<CategoryDto[]>(ApiConstants.getCategories);
  }

  createCategory(request: CategoryUpsertRequest): Promise<unknown> {
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('NameAr', request.nameAr);
    formData.append('Slug', request.slug);
    formData.append('Description', request.description);
    formData.append('DescriptionAr', request.descriptionAr);
    formData.append('ImageUrl', request.imageUrl);
    formData.append('DisplayOrder', request.displayOrder.toString());

    if (request.parentCategoryId) {
      formData.append('ParentCategoryId', request.parentCategoryId);
    }

    if (request.imageFile) {
      formData.append('ImageFile', request.imageFile);
    }

    return apiService.post(ApiConstants.createCategory, formData, {
      headers: { Accept: 'application/json' },
    });
  }
}
