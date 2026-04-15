"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/components/cart-provider';
import { Order } from '@/lib/types';

export function PaymentForm() {
  const router = useRouter();
  const { items, total, clearCart, addOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [upiReference, setUpiReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || items.length === 0) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isPaid = false;

    // Generate a short, sequential reference number (ORD-1001, ORD-1002, ...)
    const lastNum = parseInt(localStorage.getItem('last-order-number') || '1000', 10);
    const nextNum = lastNum + 1;
    localStorage.setItem('last-order-number', String(nextNum));
    const orderNumber = `ORD-${nextNum}`;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      items: [...items],
      total,
      status: 'pending',
      customerName,
      customerPhone,
      paymentMethod,
      isPaid,
      paymentReference: upiReference || undefined,
      createdAt: new Date(),
    };

    addOrder(order);
    clearCart();
    setIsProcessing(false);

    // Redirect to tracking page
    router.push(`/track?orderId=${order.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => {
              setPaymentMethod(v as 'upi' | 'cash');
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                <Banknote className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Cash on Pickup</p>
                  <p className="text-sm text-muted-foreground">Pay when you collect</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* UPI Details (shown when UPI is selected) */}
      {paymentMethod === 'upi' && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="upi-ref" className="text-sm">Transaction Reference (Optional)</Label>
              <Input
                id="upi-ref"
                placeholder="Enter 12-digit UPI Ref No."
                value={upiReference}
                onChange={(e) => setUpiReference(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground italic">
                Entering reference number helps us verify your payment faster.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isProcessing || items.length === 0}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Place Order - ₹${total}`
        )}
      </Button>
    </form>
  );
}
