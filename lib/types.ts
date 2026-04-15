export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'breakfast' | 'snacks' | 'beverages' | 'meals';
  available: boolean;
  isSpecial?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  customerName: string;
  customerPhone: string;
  paymentMethod: 'upi' | 'cash';
  isPaid: boolean;
  paymentReference?: string;
  createdAt: Date;
}
export interface DailySpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  available: boolean;
  date: string;
}
