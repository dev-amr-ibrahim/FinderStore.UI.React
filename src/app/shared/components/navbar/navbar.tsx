import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from '../../../features/search/search';
import { MegaMenu } from '../mega-menu/mega-menu';
import { cartService } from '../../../core/services/cart.service';
import { authService } from '../../../core/services/auth.service';
import { themeService } from '../../../core/services/theme.service';
import whiteLogo from '../../../../assets/white_version.png';
import blackLogo from '../../../../assets/black_version.png';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (searchOpen && !target.closest('[data-search-trigger]') && !target.closest('[data-search]')) {
        setSearchOpen(false);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [searchOpen, userMenuOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const closeUserMenu = () => setUserMenuOpen(false);

  const signOut = () => {
    authService.logout();
    closeUserMenu();
    navigate('/');
  };

  const userName = () => {
    const user = authService.getCurrentUser();
    return user?.name || user?.fullname || 'Account';
  };

  const toggleLanguage = () => {
    const newLang = themeService.getLanguage() === 'en' ? 'ar' : 'en';
    themeService.setLanguage(newLang);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={themeService.getTheme() === 'dark' ? whiteLogo : blackLogo}
                alt="Finder Store"
                title="Finder Store"
                className="w-auto h-8"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <MegaMenu />
            <Link
              to="/products"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              data-search-trigger
              onClick={toggleSearch}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => themeService.toggleTheme()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {themeService.getTheme() === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {themeService.getLanguage() === 'en' ? 'عربي' : 'EN'}
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link
              to="/cart"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartService.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale">
                  {cartService.itemCount}
                </span>
              )}
            </Link>

            {authService.isLoggedIn() ? (
              <div className="relative" ref={userMenuRef} data-user-menu>
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open user menu"
                  className="flex items-center gap-2 rounded-full p-1.5 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                >
                  <span className="hidden lg:block max-w-32 truncate text-sm font-medium">
                    {userName()}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <svg className="hidden sm:block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div role="menu" className="user-dropdown absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{userName()}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{authService.getCurrentUser()?.email}</p>
                    </div>
                    <Link to="/admin" onClick={closeUserMenu} role="menuitem" className="user-menu-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-200">Admin dashboard</Link>
                    <Link to="/profile" onClick={closeUserMenu} role="menuitem" className="user-menu-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-200">Profile</Link>
                    <Link to="/settings" onClick={closeUserMenu} role="menuitem" className="user-menu-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-200">Settings</Link>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
                    <button type="button" onClick={signOut} role="menuitem" className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/account/login"
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}

            <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800">Home</Link>
            <Link to="/categories" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800">Categories</Link>
            <Link to="/products" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800">Products</Link>
            <Link to="/about" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800">About</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800">Contact</Link>
          </div>
        </div>
      )}

      {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
    </nav>
  );
}
