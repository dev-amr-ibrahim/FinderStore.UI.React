import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { authService } from '../../core/services/auth.service';
import { themeService } from '../../core/services/theme.service';
import blackLogo from '../../../assets/black_version.png';
import whiteLogo from '../../../assets/white_version.png';

const navigation = [
  { to: '/admin', label: 'Overview', icon: 'M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z', end: true },
  { to: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m-8-14 8 4m-8-4v10l8 4m0-10v10', end: false },
  { to: '/admin/categories', label: 'Categories', icon: 'M4 6h16M4 12h16M4 18h10', end: false },
];

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between px-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={themeService.getTheme() === 'dark' ? whiteLogo : blackLogo} alt="Finder Store" className="h-8 w-auto" />
          <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary-700 dark:bg-primary-950 dark:text-primary-300">Admin</span>
        </Link>
        <button onClick={() => setMenuOpen(false)} className="p-2 text-slate-500 lg:hidden" aria-label="Close menu">×</button>
      </div>

      <nav className="mt-10 space-y-1" aria-label="Admin navigation">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Catalog</p>
        {navigation.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} /></svg>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">More tools coming soon</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Orders, customers, discounts, and reports will live here.</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      {menuOpen && <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>{sidebar}</div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-8">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Open navigation">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="hidden text-sm text-slate-500 sm:block">Catalog management</div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => themeService.toggleTheme()} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle color theme">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.4 6.4l-.7-.7M6.3 6.3l-.7-.7m12.8 0l-.7.7M6.3 17.7l-.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.name || user?.fullname || 'Administrator'}</p><p className="text-xs text-slate-500">Store manager</p></div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">{(user?.name || user?.fullname || 'A').charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
