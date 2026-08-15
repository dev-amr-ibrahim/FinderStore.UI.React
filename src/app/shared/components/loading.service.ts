class LoadingService {
  private isLoading: boolean = false;
  private listeners: Array<(loading: boolean) => void> = [];

  getLoading() {
    return this.isLoading;
  }

  show(): void {
    this.isLoading = true;
    this.notify();
  }

  hide(): void {
    this.isLoading = false;
    this.notify();
  }

  subscribe(listener: (loading: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.isLoading));
  }
}

export const loadingService = new LoadingService();
