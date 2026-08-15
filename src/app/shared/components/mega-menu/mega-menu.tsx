import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../../../data/mock-data';
import { Category } from '../../../core/interfaces/product.interface';

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
        Categories
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-[600px] pt-2 z-50">
          <div className="glass-card p-6 animate-scale">
            <div className="grid grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/categories/${category.id}`} className="group block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-center">{category.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
