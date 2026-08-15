import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Discover Premium
            <br />
            <span className="text-gray-900 dark:text-white">Lifestyle Products</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up">
            Curated collection of luxury items for the modern lifestyle.
            Quality meets elegance in every piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/products" className="btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-transform">
              Shop Now →
            </Link>
            <Link to="/categories" className="btn-secondary text-lg px-8 py-4">
              View Collections
            </Link>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </section>
  );
}
