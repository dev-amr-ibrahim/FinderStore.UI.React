import { useState, useEffect } from 'react';
import { toastService } from './toast.service';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

function getToastClasses(type: string): string {
  const baseClasses = 'px-4 py-3 rounded-xl shadow-xl backdrop-blur-lg border max-w-sm';

  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
    case 'error':
      return `${baseClasses} bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
    case 'warning':
      return `${baseClasses} bg-yellow-50/90 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
    default:
      return `${baseClasses} bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`;
  }
}

export function Toast() {
  const [toasts, setToasts] = useState<Toast[]>(toastService.getToasts());

  useEffect(() => {
    const unsubscribe = toastService.subscribe(() => {
      setToasts([...toastService.getToasts()]);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id: number) => {
    toastService.remove(id);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto animate-slide-up ${getToastClasses(toast.type)}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-auto opacity-50 hover:opacity-100">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
