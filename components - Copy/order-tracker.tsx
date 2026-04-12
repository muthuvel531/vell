"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChefHat, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/components/cart-provider';
import { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OrderTrackerProps {
  orderId?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready for Pickup', icon: Package },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function OrderTracker({ orderId }: OrderTrackerProps) {
  const { orders, updateOrderStatus } = useCart();
  const [order, setOrder] = useState<Order | undefined>();

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId, orders]);

  // Simulate order status progression
  useEffect(() => {
    if (!order || order.status === 'completed') return;

    const progressOrder = () => {
      if (order.status === 'pending') {
        updateOrderStatus(order.id, 'preparing');
      } else if (order.status === 'preparing') {
        updateOrderStatus(order.id, 'ready');
      }
    };

    const timer = setTimeout(progressOrder, 5000); // Progress every 5 seconds for demo
    return () => clearTimeout(timer);
  }, [order, updateOrderStatus]);

  if (!order) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No order found. Please place an order first.</p>
        </CardContent>
      </Card>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order #{order.id}</span>
            <span className={cn(
              "text-sm px-3 py-1 rounded-full",
              order.status === 'ready' && "bg-accent text-accent-foreground",
              order.status === 'preparing' && "bg-primary/20 text-primary",
              order.status === 'pending' && "bg-muted text-muted-foreground",
              order.status === 'completed' && "bg-accent text-accent-foreground"
            )}>
              {order.status === 'ready' ? 'Ready for Pickup!' : 
               order.status === 'preparing' ? 'Preparing...' :
               order.status === 'pending' ? 'Order Placed' : 'Completed'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-foreground font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="text-foreground font-medium">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="text-foreground font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-primary font-semibold">₹{order.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex items-center gap-4 pb-6 last:pb-0">
                  {/* Line connector */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-5 w-0.5 h-6 translate-y-10",
                        isCompleted ? "bg-primary" : "bg-border"
                      )}
                      style={{ top: `${index * 56}px` }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isCurrent && "animate-pulse")} />
                  </div>
                  
                  {/* Label */}
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && step.key === 'preparing' && (
                      <p className="text-sm text-muted-foreground">
                        Your food is being prepared...
                      </p>
                    )}
                    {isCurrent && step.key === 'ready' && (
                      <p className="text-sm text-accent font-medium">
                        Please collect from counter!
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
