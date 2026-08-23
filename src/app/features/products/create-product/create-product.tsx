import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../../core/services/product.service';
import { authService } from '../../../core/services/auth.service';
import { ProductForm, type ProductFormData } from '../product-form/product-form';

const productService = new ProductService();

export function CreateProduct() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (request: ProductFormData) => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            await productService.createProduct({ ...request, createdBy: authService.getCurrentUser()?.email || 'admin' });
            navigate('/admin/products');
        } catch (error: any) {
            setErrorMessage(error?.error?.message || 'Failed to create product. Please try again.');
            setIsLoading(false);
        }
    };

    return <ProductForm submitLabel="Create Product" submittingLabel="Creating..." isSubmitting={isLoading} errorMessage={errorMessage} onSubmit={onSubmit} onCancel={() => navigate('/admin/products')} />;
}