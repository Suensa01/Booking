export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Completed' | 'Cancelled';

export type PaymentMethod = 'COD' | 'UPI' | 'Card';

export type OrderType = 'Delivery' | 'Pickup';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  isVeg: boolean;
  rating?: number;
  prepTime?: string;
  badge?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
  category?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount?: number;
  tip?: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  notes?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  paymentId?: string;
  couponCode?: string;
}

export interface CheckoutFormData {
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  notes?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  tip?: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  guests: number;
  date: string;
  timeSlot: string;
  seatingArea: 'Indoor Dining' | 'Outdoor Terrace' | 'Chef\'s Counter' | 'Private Lounge';
  specialRequests?: string;
  status: 'Confirmed' | 'Seated' | 'Cancelled';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  discountFixed?: number;
  minOrder: number;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  minOrder: number;
  taxRatePercent: number;
}
