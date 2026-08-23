import { useEffect, useRef, useState } from 'react';
import { CategoryService } from '../../../core/services/category.service';
import type { Product } from '../../../core/interfaces/product.interface';
import type { CategoryLite } from '../../../core/models/categoryLite';
import type { CreateProductImageDto, CreateProductRequest } from '../../../../models/CreateProductRequest';

const categoryService = new CategoryService();

export type ProductFormData = Omit<CreateProductRequest, 'createdBy' | 'productImages'> & {
    productImages: CreateProductImageDto[];
};

interface ProductFormProps {
    initialProduct?: Product;
    isSubmitting?: boolean;
    errorMessage?: string;
    submitLabel: string;
    submittingLabel: string;
    onSubmit: (request: ProductFormData) => Promise<void>;
    onCancel: () => void;
}

interface FormValues {
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: string;
    compareAtPrice: string;
    sku: string;
    stockQuantity: string;
    categoryId: string;
}

interface ImageItem {
    id: number;
    file?: File;
    previewUrl: string;
    altText: string;
    altTextAr: string;
    isPrimary: boolean;
}

export function ProductForm({ 
    initialProduct, 
    isSubmitting = false, 
    errorMessage = '', 
    submitLabel, 
    submittingLabel, 
    onSubmit, 
    onCancel 
}: ProductFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<CategoryLite[]>([]);
    const [values, setValues] = useState<FormValues>(getInitialValues(initialProduct));
    const [images, setImages] = useState<ImageItem[]>(getInitialImages(initialProduct));
    const [error, setError] = useState('');

    // Load categories
    useEffect(() => {
        categoryService.getCategoriesListLite()
            .then(setCategories)
            .catch(() => setCategories([]));
    }, []);

    // Form field handlers
    const handleChange = (field: keyof FormValues, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    // Image handlers
    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newImages = Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            file,
            previewUrl: URL.createObjectURL(file),
            altText: '',
            altTextAr: '',
            isPrimary: images.length === 0 && index === 0,
        }));

        setImages(prev => [...prev, ...newImages]);
        event.target.value = '';
    };

    const handleRemoveImage = (id: number) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            // If primary was removed, make the first image primary
            if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
                filtered[0].isPrimary = true;
            }
            return filtered;
        });
    };

    const handleImageAltChange = (id: number, field: 'altText' | 'altTextAr', value: string) => {
        setImages(prev => prev.map(img => 
            img.id === id ? { ...img, [field]: value } : img
        ));
    };

    const handleSetPrimary = (id: number) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isPrimary: img.id === id
        })));
    };

    // Submit handler
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        // Validation
        if (!values.name || !values.nameAr || !values.price || !values.sku || !values.stockQuantity || !values.categoryId) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!initialProduct && images.length === 0) {
            setError('Please add at least one product image.');
            return;
        }

        // Prepare submission data
        const formData: ProductFormData = {
            name: values.name,
            nameAr: values.nameAr,
            description: values.description,
            descriptionAr: values.descriptionAr,
            price: parseFloat(values.price),
            compareAtPrice: values.compareAtPrice ? parseFloat(values.compareAtPrice) : undefined,
            sku: values.sku,
            stockQuantity: parseInt(values.stockQuantity, 10),
            categoryId: values.categoryId,
            productImages: images
                .filter(img => img.file)
                .map(img => ({
                    file: img.file!,
                    alt: img.altText,
                    altAr: img.altTextAr,
                    isPrimary: img.isPrimary,
                })),
        };

        await onSubmit(formData);
    };
console.log('ProductForm rendered with values:', values, 'and images:', images);
console.log('ProductForm rendered with values:', initialProduct, 'and images:', images);
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {initialProduct ? 'Update Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {initialProduct ? 'Update product details and images.' : 'Create a new product with images and details.'}
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error Messages */}
                {(error || errorMessage) && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {error || errorMessage}
                    </div>
                )}

                {/* Product Information */}
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-6 text-xl font-semibold">Product Information</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={values.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="input-field"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Name Arabic */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Name (Arabic) *
                            </label>
                            <input
                                type="text"
                                value={values.nameAr}
                                onChange={(e) => handleChange('nameAr', e.target.value)}
                                className="input-field"
                                placeholder="أدخل اسم المنتج بالعربية"
                                dir="rtl"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={values.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="input-field resize-none"
                                rows={3}
                                placeholder="Describe the product"
                            />
                        </div>

                        {/* Description Arabic */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description (Arabic)
                            </label>
                            <textarea
                                value={values.descriptionAr}
                                onChange={(e) => handleChange('descriptionAr', e.target.value)}
                                className="input-field resize-none"
                                rows={3}
                                placeholder="أدخل وصف المنتج بالعربية"
                                dir="rtl"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Price *
                            </label>
                            <input
                                type="number"
                                value={values.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                className="input-field"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Compare at Price */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Compare-at Price
                            </label>
                            <input
                                type="number"
                                value={values.compareAtPrice}
                                onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                                className="input-field"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                SKU *
                            </label>
                            <input
                                type="text"
                                value={values.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                className="input-field"
                                placeholder="SKU-001"
                                required
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                value={values.stockQuantity}
                                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                                className="input-field"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category *
                            </label>
                            <select
                                value={values.categoryId}
                                onChange={(e) => handleChange('categoryId', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Product Images */}
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Product Images</h2>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-outline text-sm"
                        >
                            Add Images
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddImages}
                            className="hidden"
                        />
                    </div>

                    {images.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                            <p className="mb-3 text-gray-600 dark:text-gray-400">No images added yet.</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary text-sm"
                            >
                                Select Images
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {images.map(image => (
                                <div key={image.id} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={image.previewUrl}
                                            alt={image.altText || 'Product preview'}
                                            className="h-full w-full object-cover"
                                        />
                                        {image.isPrimary && (
                                            <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                                Primary
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(image.id)}
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white hover:bg-red-600"
                                            aria-label="Remove image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="space-y-3 p-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Image Alt Text
                                            </label>
                                            <input
                                                value={image.altText}
                                                onChange={(e) => handleImageAltChange(image.id, 'altText', e.target.value)}
                                                className="input-field mt-1 text-sm"
                                                placeholder="Describe the image"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Image Alt Text (Arabic)
                                            </label>
                                            <input
                                                value={image.altTextAr}
                                                onChange={(e) => handleImageAltChange(image.id, 'altTextAr', e.target.value)}
                                                className="input-field mt-1 text-sm"
                                                placeholder="وصف الصورة بالعربية"
                                                dir="rtl"
                                            />
                                        </div>
                                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="primaryImage"
                                                checked={image.isPrimary}
                                                onChange={() => handleSetPrimary(image.id)}
                                            />
                                            Set as primary image
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-8 py-3 disabled:opacity-50"
                    >
                        {isSubmitting ? submittingLabel : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper functions
function getInitialValues(product?: Product): FormValues {
    return {
        name: product?.name || '',
        nameAr: product?.nameAr || '',
        description: product?.description || '',
        descriptionAr: product?.descriptionAr || '',
        price: product?.price?.toString() || '',
        compareAtPrice: product?.compareAtPrice?.toString() || '',
        sku: product?.sku || '',
        stockQuantity: product?.stockQuantity?.toString() || '',
        categoryId: product?.category?.id?.toString() || '',
    };
}

function getInitialImages(product?: Product): ImageItem[] {
    return product?.images.map(image => ({
        id: image.id,
        previewUrl: image.url,
        altText: image.alt || '',
        altTextAr: image.altAr || '',
        isPrimary: image.isPrimary,
        file: undefined,
    })) || [];
}