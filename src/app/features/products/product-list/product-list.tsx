import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { ProductService } from '../../../core/services/product.service';
import type { Product } from '../../../core/interfaces/product.interface';

const productService = new ProductService();

export function ProductList() {
  const routeParams = useParams<{ id?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('All Products');

  useEffect(() => {
    if (routeParams.id) {
      setCategoryId(routeParams.id);
      loadProductsByCategory(routeParams.id);
    } else {
      loadAllProducts();
    }
  }, [routeParams.id]);

  useEffect(() => {
    if (!categoryId) {
      loadAllProducts();
    }
  }, [categoryId]);

  const loadAllProducts = () => {
    productService.getProducts().subscribe({
      next: (prods: Product[]) => setProducts(prods),
    });
  };

  const loadProductsByCategory = (catId: string) => {
    productService.getProducts().subscribe({
      next: (prods: Product[]) => {
        const filtered = prods.filter((p: Product) => p.category.id === catId);
        setProducts(filtered);
        if (filtered.length > 0) {
          setCategoryName(filtered[0].category.name);
        }
      },
    });
  };

  const sortProducts = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const currentProducts = [...products];

    switch (value) {
      case 'price-low':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        currentProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        currentProducts.sort((a, b) => b.id - a.id);
    }

    setProducts(currentProducts);
  };

  const filterByCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      loadProductsByCategory(value);
      setCategoryId(value);
    } else {
      setCategoryId(null);
      loadAllProducts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {categoryId ? categoryName : 'All Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {products.length} products found
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <select className="input-field w-auto" onChange={sortProducts}>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <select className="input-field w-auto" onChange={filterByCategory}>
          <option value="">All Categories</option>
          <option value="1">Electronics</option>
          <option value="2">Fashion</option>
          <option value="3">Home & Living</option>
          <option value="4">Beauty</option>
          <option value="5">Sports</option>
          <option value="6">Books</option>
        </select>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Products Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}
