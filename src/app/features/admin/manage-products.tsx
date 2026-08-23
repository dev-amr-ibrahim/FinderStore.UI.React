import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../core/services/product.service';
import type { Product } from '../../core/interfaces/product.interface';

const productService = new ProductService();

export function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getProducts();
        setProducts(products);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();

  }, []);

  const visibleProducts = products.filter(product => `${product.name} ${product.sku} ${product.category.name}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>
      <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Catalog</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Products</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{products.length} products in your store.</p></div>
      <Link to="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm">Add product</Link>
    </div><div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <input 
        value={query} onChange={event => setQuery(event.target.value)} className="input-field max-w-md py-2" placeholder="Search by name, SKU, or category" aria-label="Search products" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900">
            <tr><th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
            </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleProducts.map(product =>
              <tr key={product.id} onClick={() => navigate(`/admin/products/${product.id}`)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') navigate(`/admin/products/${product.id}`); }} tabIndex={0} role="link" className="cursor-pointer hover:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-slate-900/60">
                <td className="px-6 py-4">
                  <Link to={`/admin/products/${product.id}`} className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <img src={product.images[0]?.url} alt="" className="h-10 w-10 rounded-lg bg-slate-100 object-cover" />
                    <span className="font-semibold">{product.name}</span>
                  </Link></td>
                <td className="px-6 py-4 text-slate-500">{product.category.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.sku}</td>
                <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4"> <span className={product.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}>{product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}</span></td>
              </tr>)}
          </tbody>
        </table>
      </div>{visibleProducts.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No products match your search.</p>}</div>
  </div>;
}
