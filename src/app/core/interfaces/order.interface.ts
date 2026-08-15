export interface Address {
  id: number;
  type: AddressType;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export const AddressType = {
  SHIPPING: 'shipping',
  BILLING: 'billing'
} as const;

export type AddressType = typeof AddressType[keyof typeof AddressType];

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  placedAt: Date;
  updatedAt: Date;
}

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'apple_pay';
  last4?: string;
  brand?: string;
}

export interface CartItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  maxQuantity: number;
}
