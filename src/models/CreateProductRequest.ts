export interface CreateProductRequest {
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    stockQuantity: number;
    categoryId: string;
    createdBy: string;
    productImages: CreateProductImageDto[];
}

export interface CreateProductImageDto {
    file: File;
    alt: string;
    altAr?: string;
    isPrimary: boolean;
}