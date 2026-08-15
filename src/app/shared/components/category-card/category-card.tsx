import { Link } from 'react-router-dom';
import { Category } from '../../../core/interfaces/product.interface';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.id}`} className="card block text-center p-6 hover-lift cursor-pointer group">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {category.description}
      </p>
    </Link>
  );
}
