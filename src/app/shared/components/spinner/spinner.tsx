import { useState, useEffect } from 'react';
import { loadingService } from '../loading.service';

export function Spinner() {
  const [isLoading, setIsLoading] = useState(loadingService.getLoading());

  useEffect(() => {
    const unsubscribe = loadingService.subscribe((loading) => {
      setIsLoading(loading);
    });
    return unsubscribe;
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
