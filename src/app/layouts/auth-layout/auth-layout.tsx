import { Outlet } from 'react-router-dom';
import blackLogo from '../../../assets/black_version.png';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex" aria-label="Finder home">
            <img src={blackLogo} alt="Finder" className="w-44 h-auto" />
          </a>
        </div>
        <div className="glass-card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
