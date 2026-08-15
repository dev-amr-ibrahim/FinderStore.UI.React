import { useEffect, useState } from 'react';
import { ProductService } from '../../core/services/product.service';
import { CategoryCard } from '../../shared/components/category-card/category-card';
import type { Category } from '../../core/interfaces/product.interface';

const productService = new ProductService();

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const sub = productService.getCategories().subscribe({
      next: (cats: Category[]) => setCategories(cats),
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Shop by Category
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover our curated collection of premium categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
