export interface CategoryUpsertRequest {
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  displayOrder: number;
  parentCategoryId: string | null;
  imageFile: File | null;
}
