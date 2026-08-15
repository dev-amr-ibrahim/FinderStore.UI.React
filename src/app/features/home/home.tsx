import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCarousel } from '../../shared/components/product-carousel/product-carousel';
import { CategoryCard } from '../../shared/components/category-card/category-card';
import { ProductService } from '../../core/services/product.service';
import type { Product, Category } from '../../core/interfaces/product.interface';

const productService = new ProductService();

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const sub1 = productService.getFeaturedProducts().subscribe({
      next: (products: Product[]) => setFeaturedProducts(products),
    });
    const sub2 = productService.getNewArrivals().subscribe({
      next: (products: Product[]) => setNewArrivals(products),
    });
    const sub3 = productService.getCategories().subscribe({
      next: (cats: Category[]) => setCategories(cats),
    });
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="bg-gray-50 border-t border-gray-200 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Premium Quality</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Curated products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Free Shipping</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">256-bit SSL</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">↩️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">30-day policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center mb-8">
          <h2 className="w-full text-center text-3xl font-display font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
        </div>
        <ProductCarousel products={featuredProducts} />
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            New Arrivals
          </h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <ProductCarousel products={newArrivals} />
      </section>
    </div>
  );
}
