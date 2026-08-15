import { CartItem } from '../interfaces/order.interface';
import { toastService } from '../../shared/components/toast/toast.service';

class CartServiceClass {
  private items: CartItem[] = [];

  get itemsList() {
    return this.items;
  }

  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get tax() {
    return this.subtotal * 0.1;
  }

  get total() {
    return this.subtotal + this.tax;
  }

  addItem(item: CartItem): void {
    const existing = this.items.find(i => i.productId === item.productId && i.variant === item.variant);
    if (existing) {
      if (existing.quantity < existing.maxQuantity) {
        existing.quantity += 1;
      }
    } else {
      this.items = [...this.items, { ...item, quantity: 1 }];
    }
    toastService.show('Item added to cart', 'success');
  }

  removeItem(productId: number, variant?: string): void {
    this.items = this.items.filter(i => !(i.productId === productId && i.variant === variant));
  }

  updateQuantity(productId: number, quantity: number, variant?: string): void {
    if (quantity < 1) {
      this.removeItem(productId, variant);
      return;
    }
    this.items = this.items.map(i =>
      i.productId === productId && i.variant === variant
        ? { ...i, quantity }
        : i
    );
  }

  clearCart(): void {
    this.items = [];
  }
}

export const cartService = new CartServiceClass();
