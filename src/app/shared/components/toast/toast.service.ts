class ToastService {
  private toasts: Array<{ id: number; message: string; type: 'success' | 'error' | 'info' | 'warning' }> = [];
  private listeners: Array<() => void> = [];
  private nextId = 1;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const toast = { id: this.nextId++, message, type };
    this.toasts = [...this.toasts, toast];
    this.notify();
    setTimeout(() => {
      this.remove(toast.id);
    }, 3000);
  }

  getToasts() {
    return this.toasts;
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
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
}

export const toastService = new ToastService();
