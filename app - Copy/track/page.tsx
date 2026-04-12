"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OrderTracker } from '@/components/order-tracker';
import { useCart } from '@/components/cart-provider';

function TrackContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const [searchOrderId, setSearchOrderId] = useState(orderIdFromUrl || '');
  const [activeOrderId, setActiveOrderId] = useState(orderIdFromUrl || '');
  const { orders } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveOrderId(searchOrderId);
  };

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Track Your Order
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your order ID to see the current status
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Search & Recent Orders */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Find Order</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Enter Order ID"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <button
                        key={order.id}
                        onClick={() => {
                          setActiveOrderId(order.id);
                          setSearchOrderId(order.id);
                        }}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-foreground">
                            #{order.id}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.items.length} items • ₹{order.total}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            <OrderTracker orderId={activeOrderId} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </div>
          </div>
        </main>
      }>
        <TrackContent />
      </Suspense>
      <Footer />
    </div>
  );
}
