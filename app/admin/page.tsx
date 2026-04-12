"use client";

import { useCart } from '@/components/cart-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreditCard, Edit, Plus, Trash2, KeyRound, Check, X, Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'admin'; // Simple hardcoded password for now

export default function AdminPage() {
  const { orders, codewords, addCodeword, toggleCodewordActive, updateOrderStatus } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [newCodeword, setNewCodeword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query)
    );
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'preparing':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 font-medium">Preparing</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 font-medium text-amber-950">Ready for Pickup</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 font-medium">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method: Order['paymentMethod'], codewordUsed?: string) => {
    if (method === 'upi') return 'PhonePe';
    if (method === 'cash') return 'Cash';
    if (method === 'card') return 'Card';
    if (method === 'codeword') return `Codeword (${codewordUsed})`;
    return method;
  };

  const handleAddCodeword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCodeword.trim()) {
      addCodeword(newCodeword.trim());
      setNewCodeword('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1 text-center pb-8 border-b">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif">Admin Access</CardTitle>
              <CardDescription>
                Please enter the administrator password.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                    }}
                    className={loginError ? "border-destructive focus-visible:ring-destructive" : ""}
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-sm text-destructive">Incorrect password</p>
                  )}
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Login to Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage and track all customer orders
              </p>
            </div>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="codewords">System Codewords</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-card pb-4">
                  <div>
                    <CardTitle>Track Orders</CardTitle>
                    <CardDescription>View all active and completed food orders</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                      <p className="text-lg font-medium">No orders yet</p>
                      <p className="text-sm">When customers place an order, it will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-[120px]">Reference No.</TableHead>
                            <TableHead className="min-w-[150px]">Customer Name</TableHead>
                            <TableHead>Delivery Status</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                            <TableHead className="text-center">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                              <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium">
                                  <span className="font-mono font-bold text-primary tracking-widest">
                                    {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{order.customerName}</span>
                                    <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(order.status)}
                                </TableCell>
                                <TableCell className="font-medium text-foreground/80">
                                  {getPaymentMethodDisplay(order.paymentMethod, order.codewordUsed)}
                                </TableCell>
                                <TableCell>
                                  {order.isPaid ? (
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Paid</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Unpaid</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  ₹{order.total}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2 justify-center">
                                    {order.status === 'pending' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                      >
                                        Start
                                      </Button>
                                    )}
                                    {order.status === 'preparing' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => updateOrderStatus(order.id, 'ready')}
                                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                      >
                                        Ready
                                      </Button>
                                    )}
                                    {order.status === 'ready' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => updateOrderStatus(order.id, 'completed')}
                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                      >
                                        Finish
                                      </Button>
                                    )}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">View</Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>Order Items</DialogTitle>
                                          <DialogDescription>
                                            {order.orderNumber ?? `#${order.id.slice(0, 8)}`} — {order.customerName}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                          <div className="space-y-4">
                                            {order.items.map((item) => (
                                              <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                                <div>
                                                  <p className="font-medium">{item.name}</p>
                                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-medium">₹{item.price * item.quantity}</p>
                                              </div>
                                            ))}
                                            <div className="pt-4 flex justify-between items-center font-bold text-lg">
                                              <span>Total</span>
                                              <span>₹{order.total}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No orders found matching "{searchQuery}".
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="codewords">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Manage Codewords</CardTitle>
                  <CardDescription>Create and manage codewords for staff or special users.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCodeword} className="flex gap-4 mb-8">
                    <div className="flex-1 max-w-sm">
                      <Input
                        placeholder="Enter new VIP codeword..."
                        value={newCodeword}
                        onChange={(e) => setNewCodeword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={!newCodeword.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Codeword
                    </Button>
                  </form>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Codeword</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {codewords.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                              No codewords exist yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          codewords.map((cw) => (
                            <TableRow key={cw.id}>
                              <TableCell className="font-mono font-medium">{cw.code}</TableCell>
                              <TableCell>
                                {cw.active ? (
                                  <Badge className="bg-green-500">Active</Badge>
                                ) : (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(cw.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCodewordActive(cw.id)}
                                  className={cw.active ? "text-destructive" : "text-green-600"}
                                >
                                  {cw.active ? "Deactivate" : "Activate"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
