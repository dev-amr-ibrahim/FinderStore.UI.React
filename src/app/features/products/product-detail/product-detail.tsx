import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductService } from '../../../core/services/product.service';
import { cartService } from '../../../core/services/cart.service';
import type { Product } from '../../../core/interfaces/product.interface';

const productService = new ProductService();

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    productService.getProduct(productId).subscribe({
      next: (p: Product | undefined) => {
        if (p) {
          setProduct(p);
          if (p.images.length > 0) {
            setSelectedImage(p.images[0].url);
          }
        }
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
      },
    });
  }, [id]);

  const discountPercentage = useMemo(() => {
    if (!product?.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }, [product]);

  const savingsAmount = useMemo(() => {
    if (!product?.compareAtPrice) return 0;
    return product.compareAtPrice - product.price;
  }, [product]);

  const totalPrice = product ? product.price * quantity : 0;

  const getSelectedVariant = (variantId: number) => selectedVariants[variantId];

  const selectVariant = (variantId: number, optionId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: optionId }));
  };

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const addToCart = () => {
    if (!product) return;
    cartService.addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity,
      maxQuantity: 10,
    });
    setQuantity(1);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
            {product.compareAtPrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.url)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === image.url ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-24 object-cover hover:opacity-75 transition-opacity"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/categories/${product.category.id}`} className="hover:text-primary-600 transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-green-500">
                  Save ${savingsAmount.toFixed(2)}
                </span>
              </>
            )}
          </div>

          <div className="prose dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const isSelected = getSelectedVariant(variant.id) === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => selectVariant(variant.id, option.id)}
                          disabled={!option.inStock}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-700'
                          } ${!option.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {option.value}
                          {!option.inStock && <span className="text-xs block">Out of Stock</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={!product.inStock}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50"
          >
            {product.inStock ? `Add to Cart - $${totalPrice.toFixed(2)}` : 'Out of Stock'}
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              SKU: {product.sku}
            </p>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {product.rating}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500">{product.reviewCount} reviews</p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">JD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-sm text-gray-500">Verified Purchase</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Amazing product! The quality exceeded my expectations. Would definitely recommend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
