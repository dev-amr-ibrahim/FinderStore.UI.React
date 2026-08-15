import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import type { Product } from '../../core/interfaces/product.interface';

const productService = new ProductService();

interface SearchProps {
  onClose?: () => void;
}

export function Search({ onClose }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (searchQuery.trim()) {
      productService.searchProducts(searchQuery).subscribe({
        next: (products: Product[]) => setResults(products),
      });
      } else {
        setResults([]);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const onSearchAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a[href]')) {
      onClose?.();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" onClick={onSearchAreaClick}>
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input-field text-lg pl-12 pr-4 py-4"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {searchQuery && (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {results.length} results for "{searchQuery}"
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try different keywords or browse categories.</p>
            </div>
          )}
        </>
      )}

      {!searchQuery && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Search Products</h3>
          <p className="text-gray-600 dark:text-gray-400">Type to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
