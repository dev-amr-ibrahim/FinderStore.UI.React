import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductService } from '../../core/services/product.service';
import type { Product, Category } from '../../core/interfaces/product.interface';

const productService = new ProductService();

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const productSub = productService.getProducts().then(setProducts);
    const categorySub = productService.getCategories().subscribe(setCategories);
    return () => { categorySub.unsubscribe(); };
  }, []);

  const lowStock = products.filter(product => product.stockQuantity <= 0).length;
  const stats = [
    { label: 'Products', value: products.length, detail: 'Items in your catalog' },
    { label: 'Categories', value: categories.length, detail: 'Organize your inventory' },
    { label: 'Out of stock', value: lowStock, detail: lowStock ? 'Need your attention' : 'Everything is available' },
  ];

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary-600 dark:text-primary-400">Store administration</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Good to see you</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Manage your catalog from one place.</p></div><Link to="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm">Add product</Link></div>
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(stat => <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold">{stat.value}</p><p className="mt-2 text-xs text-slate-500">{stat.detail}</p></div>)}</div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Catalog shortcuts</h2><p className="mt-1 text-sm text-slate-500">Start with the areas you manage most.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Link to="/admin/products" className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-slate-800 dark:hover:bg-primary-950/30"><p className="font-semibold">Manage products</p><p className="mt-1 text-sm text-slate-500">View catalog items and add new products.</p></Link><Link to="/admin/categories" className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-slate-800 dark:hover:bg-primary-950/30"><p className="font-semibold">Manage categories</p><p className="mt-1 text-sm text-slate-500">Review the categories used in your catalog.</p></Link></div></section>
  </div>;
}
