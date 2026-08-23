import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryService } from '../../core/services/category.service';
import { CategoryDto } from '../../core/models/categoryDto';

export function ManageCategories() {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await categoryService.getCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Catalog</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Review and organize the groups used in your product catalog.</p>
      </div>
      <Link to="/admin/categories/new" className="btn-primary px-5 py-2.5 text-sm">Add category</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {
        categories.map(category => {
          return <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <img src={category.imageUrl} alt={category.name} className="h-32 w-full bg-slate-100 object-cover" />
            <div className="p-5"><div className="flex items-start justify-between gap-3">
              <h2 className="font-bold">{category.name}</h2>
              <span className="badge-primary whitespace-nowrap">{category.productCount} products</span>
            </div>
              <p className="mt-2 min-h-10 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-400">/{category.slug}</p>
            </div>
          </article>;
        })}
    </div>
    <img src="/images/empty-categories.svg" alt="No categories" className={`mx-auto mt-12 ${categories.length > 0 ? 'hidden' : ''}`} />
  </div>;
}