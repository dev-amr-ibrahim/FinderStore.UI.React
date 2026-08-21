import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../../core/services/product.service';
import { authService } from '../../../core/services/auth.service';
import type { Category } from '../../../core/interfaces/product.interface';
import type { CreateProductImageDto } from '../../../../models/CreateProductRequest';

const productService = new ProductService();

interface ProductImage extends CreateProductImageDto {
    preview: string;
    tempId: number;
}

export function CreateProduct() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        price: '',
        compareAtPrice: '',
        sku: '',
        stockQuantity: '',
        categoryId: '',
    });

    useEffect(() => {
        productService.getCategories().subscribe({
            next: (cats: Category[]) => setCategories(cats),
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ProductImage[] = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            alt: '',
            altAr: '',
            isPrimary: images.length === 0 && files.length > 0,
            tempId: Date.now() + Math.random(),
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (tempId: number) => {
        setImages(prev => {
            const updated = prev.filter(img => img.tempId !== tempId);
            if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
                updated[0].isPrimary = true;
            }
            return updated;
        });
    };

    const setPrimaryImage = (tempId: number) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isPrimary: img.tempId === tempId,
        })));
    };

    const updateImageAlt = (tempId: number, field: 'alt' | 'altAr', value: string) => {
        setImages(prev => prev.map(img => 
            img.tempId === tempId ? { ...img, [field]: value } : img
        ));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.name || !formData.nameAr || !formData.price || !formData.sku || !formData.stockQuantity || !formData.categoryId) {
            setErrorMessage('Please fill in all required fields');
            return;
        }

        if (images.length === 0) {
            setErrorMessage('Please add at least one product image');
            return;
        }

        setIsLoading(true);

        try {
            const request = {
                name: formData.name,
                nameAr: formData.nameAr,
                description: formData.description,
                descriptionAr: formData.descriptionAr,
                price: parseFloat(formData.price),
                compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
                sku: formData.sku,
                stockQuantity: parseInt(formData.stockQuantity, 10),
                categoryId: formData.categoryId,
                createdBy: authService.getCurrentUser()?.email || 'admin',
                productImages: images.map(img => ({
                    file: img.file,
                    alt: img.alt,
                    altAr: img.altAr,
                    isPrimary: img.isPrimary,
                })),
            };

            await productService.createProduct(request);
            setSuccessMessage('Product created successfully!');
            setTimeout(() => navigate('/products'), 1500);
        } catch (error: any) {
            setErrorMessage(error?.error?.message || 'Failed to create product. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Product</h1>
                <p className="text-gray-600 dark:text-gray-400">Create a new product with images and details</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
                {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Product Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Arabic) *</label>
                            <input
                                type="text"
                                name="nameAr"
                                value={formData.nameAr}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="اسم المنتج"
                                dir="rtl"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="input-field resize-none"
                                placeholder="Product description"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Arabic)</label>
                            <textarea
                                name="descriptionAr"
                                value={formData.descriptionAr}
                                onChange={handleInputChange}
                                rows={3}
                                className="input-field resize-none"
                                placeholder="وصف المنتج"
                                dir="rtl"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compare At Price</label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                value={formData.compareAtPrice}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="SKU-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity *</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Images</h2>
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
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {images.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                            <div className="text-4xl mb-3">🖼️</div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">No images added yet</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary text-sm"
                            >
                                Select Images
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map(image => (
                                <div key={image.tempId} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={image.preview}
                                            alt={image.alt || 'Product preview'}
                                            className="w-full h-full object-cover"
                                        />
                                        {image.isPrimary && (
                                            <span className="absolute top-2 left-2 badge-primary">Primary</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.tempId)}
                                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Alt Text</label>
                                            <input
                                                type="text"
                                                value={image.alt}
                                                onChange={(e) => updateImageAlt(image.tempId, 'alt', e.target.value)}
                                                className="input-field text-sm"
                                                placeholder="Image description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Alt Text (Arabic)</label>
                                            <input
                                                type="text"
                                                value={image.altAr}
                                                onChange={(e) => updateImageAlt(image.tempId, 'altAr', e.target.value)}
                                                className="input-field text-sm"
                                                placeholder="وصف الصورة"
                                                dir="rtl"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="primaryImage"
                                                checked={image.isPrimary}
                                                onChange={() => setPrimaryImage(image.tempId)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Set as primary image</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary px-8 py-3 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            'Create Product'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}