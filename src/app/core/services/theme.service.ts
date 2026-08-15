export type ThemeMode = 'light' | 'dark';
export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

class ThemeService {
  private theme: ThemeMode = this.getInitialTheme();
  private language: Language = this.getInitialLanguage();
  private direction: Direction = this.language === 'ar' ? 'rtl' : 'ltr';

  private listeners: Array<() => void> = [];

  constructor() {
    this.applyTheme(this.theme);
    document.documentElement.dir = this.direction;
    document.documentElement.lang = this.language;
  }

  private getInitialTheme(): ThemeMode {
    const stored = localStorage.getItem('theme') as ThemeMode;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getInitialLanguage(): Language {
    return (localStorage.getItem('language') as Language) || 'en';
  }

  getTheme() {
    return this.theme;
  }

  getLanguage() {
    return this.language;
  }

  getDirection() {
    return this.direction;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    this.notify();
  }

  setLanguage(lang: Language): void {
    this.language = lang;
    this.direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = this.direction;
    document.documentElement.lang = this.language;
    localStorage.setItem('language', lang);
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
}

export const themeService = new ThemeService();
