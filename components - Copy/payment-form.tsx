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
  const { items, total, clearCart, addOrder, codewords } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash' | 'codeword'>('upi');
  const [codeword, setCodeword] = useState('');
  const [codewordError, setCodewordError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || items.length === 0) {
      return;
    }

    if (paymentMethod === 'codeword') {
      const validCodeword = codewords.find(
        (cw) => cw.code === codeword.toUpperCase() && cw.active
      );

      if (!validCodeword) {
        setCodewordError('Invalid or inactive codeword');
        return;
      }
      setCodewordError('');
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isPaid = paymentMethod === 'codeword' || paymentMethod === 'card' || paymentMethod === 'upi';

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      total,
      status: 'pending',
      customerName,
      customerPhone,
      paymentMethod,
      isPaid,
      ...(paymentMethod === 'codeword' ? { codewordUsed: codeword.toUpperCase() } : {}),
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
              setPaymentMethod(v as 'upi' | 'card' | 'cash' | 'codeword');
              setCodewordError(''); // Clear error when switching methods
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
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Card Payment</p>
                  <p className="text-sm text-muted-foreground">Credit or Debit card</p>
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

            <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="codeword" id="codeword" />
              <Label htmlFor="codeword" className="flex items-center gap-3 cursor-pointer flex-1">
                <Banknote className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Use a Codeword</p>
                  <p className="text-sm text-muted-foreground">Pay with a valid codeword</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Codeword Details (shown when Codeword is selected) */}
      {paymentMethod === 'codeword' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeword-input">Enter Codeword</Label>
              <Input 
                id="codeword-input" 
                placeholder="e.g. FREEFOOD" 
                value={codeword}
                onChange={(e) => {
                  setCodeword(e.target.value);
                  if (codewordError) setCodewordError('');
                }}
                className={codewordError ? 'border-destructive' : ''}
              />
              {codewordError && (
                <p className="text-sm text-destructive">{codewordError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* UPI Details (shown when UPI is selected) */}
      {paymentMethod === 'upi' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Scan QR code or pay to</p>
              <p className="font-mono text-lg font-semibold text-foreground">canteen@upi</p>
              <p className="text-sm text-muted-foreground mt-2">Amount: ₹{total}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card Details (shown when Card is selected) */}
      {paymentMethod === 'card' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" type="password" />
              </div>
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
