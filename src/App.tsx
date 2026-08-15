import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './app/layouts/main-layout/main-layout';
import { AuthLayout } from './app/layouts/auth-layout/auth-layout';
import { Home } from './app/features/home/home';
import { ProductList } from './app/features/products/product-list/product-list';
import { ProductDetail } from './app/features/products/product-detail/product-detail';
import { Categories } from './app/features/categories/categories';
import { Cart } from './app/features/cart/cart';
import { Checkout } from './app/features/checkout/checkout';
import { Wishlist } from './app/features/wishlist/wishlist';
import { Profile } from './app/features/account/profile/profile';
import { Settings } from './app/features/account/settings/settings';
import { Search } from './app/features/search/search';
import { About } from './app/features/information/about';
import { Contact } from './app/features/information/contact';
import { InformationPage } from './app/features/information/information-page';
import { Login } from './app/features/auth/login/login';
import { Register } from './app/features/auth/register/register';
import { NotFound } from './app/shared/components/not-found/not-found';
import { authService } from './app/core/services/auth.service';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return authService.isLoggedIn() ? <>{children}</> : <Navigate to="/account/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<ProductList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="careers" element={<InformationPage />} />
          <Route path="press" element={<InformationPage />} />
          <Route path="help-center" element={<InformationPage />} />
          <Route path="shipping-info" element={<InformationPage />} />
          <Route path="returns-exchanges" element={<InformationPage />} />
          <Route path="size-guide" element={<InformationPage />} />
          <Route path="privacy-policy" element={<InformationPage />} />
          <Route path="terms-of-service" element={<InformationPage />} />
          <Route path="cookie-policy" element={<InformationPage />} />
        </Route>
        <Route path="/account" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
