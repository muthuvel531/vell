"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, MenuItem, Order, DailySpecial } from '@/lib/types';
import { menuItems as initialMenuItems, dailySpecials as initialDailySpecials } from '@/lib/menu-data';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, isPaid: boolean) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;
  dailySpecials: DailySpecial[];
  updateDailySpecial: (special: DailySpecial) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>(initialDailySpecials);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage/API on mount
  React.useEffect(() => {
    const savedItems = localStorage.getItem('cart-items');
    const savedMenuItems = localStorage.getItem('cart-menu-items');
    const savedDailySpecials = localStorage.getItem('cart-daily-specials');
    const savedOrders = localStorage.getItem('cart-orders');

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedMenuItems) setMenuItems(JSON.parse(savedMenuItems));
    if (savedDailySpecials) setDailySpecials(JSON.parse(savedDailySpecials));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    // Fetch orders from server
    const fetchOrders = () => {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
          }
        })
        .catch(err => console.error('Failed to fetch orders:', err));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Sync every 30s
    
    setIsInitialized(true);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage when state changes
  React.useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('cart-items', JSON.stringify(items));
  }, [items, isInitialized]);

  // Handle orders separately - we now primarily use the API, 
  // but we can keep a local cache for offline/instant UI
  React.useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('cart-orders', JSON.stringify(orders));
  }, [orders, isInitialized]);

  React.useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('cart-menu-items', JSON.stringify(menuItems));
  }, [menuItems, isInitialized]);

  React.useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('cart-daily-specials', JSON.stringify(dailySpecials));
  }, [dailySpecials, isInitialized]);

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addOrder = useCallback(async (order: Order) => {
    // Optimistic update
    setOrders((prev) => [order, ...prev]);
    
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error('Failed to save order to server:', err);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
    } catch (err) {
      console.error('Failed to update order on server:', err);
    }
  }, []);
  const updatePaymentStatus = useCallback(async (orderId: string, isPaid: boolean) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isPaid } : o))
    );

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, isPaid }),
      });
    } catch (err) {
      console.error('Failed to update payment status on server:', err);
    }
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `ITEM-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  }, []);

  const updateMenuItem = useCallback((item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? item : i))
    );
  }, []);

  const removeMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateDailySpecial = useCallback((special: DailySpecial) => {
    setDailySpecials((prev) =>
      prev.map((s) => (s.id === special.id ? special : s))
    );
  }, []);



  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        orders,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        menuItems,
        addMenuItem,
        updateMenuItem,
        removeMenuItem,
        dailySpecials,
        updateDailySpecial,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

