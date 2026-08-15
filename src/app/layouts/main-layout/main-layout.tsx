import { Outlet } from 'react-router-dom';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { Toast } from '../../shared/components/toast/toast';
import { Spinner } from '../../shared/components/spinner/spinner';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <Spinner />
    </div>
  );
}
