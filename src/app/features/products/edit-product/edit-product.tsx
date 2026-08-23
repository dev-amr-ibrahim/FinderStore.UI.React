import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../../../core/interfaces/product.interface';
import { ProductService } from '../../../core/services/product.service';
import { ProductForm, type ProductFormData } from '../product-form/product-form';

const productService = new ProductService();

export function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product>();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        productService.getProductForAdmin(id).then(setProduct).catch(() => setErrorMessage('Failed to load product.')).finally(() => setIsLoading(false));
    }, [id]);

    const onSubmit = async (request: ProductFormData) => {
        if (!product) return;
        setErrorMessage('');
        setIsSubmitting(true);
        try {
            await productService.updateProduct(product.id, request);
            navigate('/admin/products');
        } catch (error: any) {
            setErrorMessage(error?.error?.message || 'Failed to update product. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="p-8 text-slate-500">Loading product...</p>;
    if (!product) return <div className="space-y-4 p-8"><p className="text-red-500">{errorMessage || 'Product not found.'}</p><button className="btn-secondary" onClick={() => navigate('/admin/products')}>Back to products</button></div>;
    return <ProductForm initialProduct={product} submitLabel="Update Product" submittingLabel="Updating..." isSubmitting={isSubmitting} errorMessage={errorMessage} onSubmit={onSubmit} onCancel={() => navigate('/admin/products')} />;
}