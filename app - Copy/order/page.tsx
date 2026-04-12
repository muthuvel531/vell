"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartSheet } from '@/components/cart-sheet';
import { PaymentForm } from '@/components/payment-form';
import { useCart } from '@/components/cart-provider';

export default function OrderPage() {
  const { items } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/menu">
              <Button variant="ghost" size="sm" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Your Order
            </h1>
            <p className="mt-2 text-muted-foreground">
              Review your items and complete your order
            </p>
          </div>

          {/* Order Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Cart */}
            <div>
              <h2 className="font-semibold text-lg text-foreground mb-4">Cart Items</h2>
              <CartSheet />
              
              {items.length === 0 && (
                <div className="mt-6">
                  <Link href="/menu">
                    <Button className="w-full">Browse Menu</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="font-semibold text-lg text-foreground mb-4">Checkout</h2>
              <PaymentForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
