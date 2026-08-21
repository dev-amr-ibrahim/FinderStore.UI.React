import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { Product, Category } from '../interfaces/product.interface';
import { mockProducts, mockCategories } from '../../data/mock-data';
import { ApiConstants } from '../constants/api.constants';
import { apiService } from './api.service';
import type { CreateProductRequest } from '../../../models/CreateProductRequest';

export class ProductService {

  getProducts(params?: any): Observable<Product[]> {
    return of(mockProducts).pipe(delay(500));
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(mockProducts.find(p => p.id === id)).pipe(delay(300));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(mockProducts.filter(p => p.featured)).pipe(delay(300));
  }

  getNewArrivals(): Observable<Product[]> {
    return of(mockProducts.slice(-4)).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(mockCategories).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(500));
  }

  async createProduct(request: CreateProductRequest) {
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('NameAr', request.nameAr);
    formData.append('Description', request.description);
    formData.append('DescriptionAr', request.descriptionAr);
    formData.append('Price', request.price.toString());
    if (request.compareAtPrice) {
      formData.append('CompareAtPrice', request.compareAtPrice.toString());
    }
    formData.append('Sku', request.sku);
    formData.append('StockQuantity', request.stockQuantity.toString());
    formData.append('CategoryId', request.categoryId);
    formData.append('CreatedBy', request.createdBy);

    request.productImages.forEach((image, index) => {
      formData.append(`ProductImages[${index}].File`, image.file);
      formData.append(`ProductImages[${index}].Alt`, image.alt);
      if (image.altAr) {
        formData.append(`ProductImages[${index}].AltAr`, image.altAr);
      }
      formData.append(`ProductImages[${index}].IsPrimary`, image.isPrimary.toString());
    });

    return apiService.post(ApiConstants.createProduct, formData, {
        headers: { 'Accept': 'application/json' }
    });
  }
}