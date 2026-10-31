export type Size = 'S' | 'M' | 'Standard';

export interface ExtraOption {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  nameEn: string;
  category: 
    | 'signature'
    | 'classic'
    | 'special'
    | 'iced'
    | 'chillers'
    | 'waffles'
    | 'alternative'
    | 'tea'
    | 'milkshakes'
    | 'icecream';
  priceS?: number;
  priceM?: number;
  singlePrice?: number;
  description: string;
  descriptionEn: string;
  isSignature?: boolean;
  isPopular?: boolean;
  hasSizes: boolean;
  allowsMilkChoice?: boolean;
  allowsExtras?: boolean;
  threeModel?: 'cup' | 'chocolate' | 'waffle' | 'frappe';
  imagePlaceholder?: string;
  calories?: string;
  tags?: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  nameEn: string;
  size: Size;
  price: number;
  quantity: number;
  milk?: string;
  temperature?: 'İsti' | 'Soyuq' | 'Buzlu';
  extras: {
    id: string;
    name: string;
    price: number;
  }[];
  notes?: string;
}

export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'applepay';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  branch?: string;
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}

export interface Branch {
  id: string;
  name: string;
  district: string;
  address: string;
  landmark: string;
  hours: string;
  phone: string;
  isRooftop?: boolean;
  features: string[];
}
