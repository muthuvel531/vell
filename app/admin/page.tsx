"use client";

import { useCart } from '@/components/cart-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, CreditCard, Edit, Plus, Trash2, KeyRound, Check, X, Lock, Image as ImageIcon, LayoutGrid, Flame, Settings as SettingsIcon, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = 'admin'; // Simple hardcoded password for now

export default function AdminPage() {
  const { 
    orders, 
    updateOrderStatus,
    updatePaymentStatus,
    menuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    dailySpecials,
    updateDailySpecial
  } = useCart();

  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Menu Form State
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast' as any,
    image: '/images/hero-food.jpg',
    available: true,
  });

  const [isSpecialDialogOpen, setIsSpecialDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<any>(null);
  const [specialFormData, setSpecialFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    available: true,
  });

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

  const getPaymentMethodDisplay = (method: Order['paymentMethod']) => {
    if (method === 'upi') return 'PhonePe';
    if (method === 'cash') return 'Cash';
    return method;
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

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...menuFormData,
      price: parseFloat(menuFormData.price) || 0,
    };

    if (editingItem) {
      updateMenuItem({ ...data, id: editingItem.id } as any);
    } else {
      addMenuItem(data as any);
    }

    setIsMenuDialogOpen(false);
    setEditingItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: 'breakfast',
      image: '/images/hero-food.jpg',
      available: true,
    });
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
    });
    setIsMenuDialogOpen(true);
  };

  const openSpecialDialog = (special: any) => {
    setEditingSpecial(special);
    setSpecialFormData({
      name: special.name,
      description: special.description,
      price: special.price.toString(),
      originalPrice: special.originalPrice.toString(),
      image: special.image,
      available: special.available,
    });
    setIsSpecialDialogOpen(true);
  };

  const handleSpecialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...specialFormData,
      id: editingSpecial.id,
      price: parseFloat(specialFormData.price) || 0,
      originalPrice: parseFloat(specialFormData.originalPrice) || 0,
    };

    updateDailySpecial(data as any);
    setIsSpecialDialogOpen(false);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const query = menuSearchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

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
                Manage your restaurant orders and menu
              </p>
            </div>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="menu">Manage Menu</TabsTrigger>
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
                                  {getPaymentMethodDisplay(order.paymentMethod)}
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
                                    {!order.isPaid && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => updatePaymentStatus(order.id, true)}
                                        className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-medium"
                                      >
                                        Mark Paid
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
                                            {order.paymentReference && (
                                              <div className="mt-1 font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block">
                                                Ref: {order.paymentReference}
                                              </div>
                                            )}
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

            <TabsContent value="customers">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-card pb-4">
                  <div>
                    <CardTitle>Customer Data</CardTitle>
                    <CardDescription>View and manage customer details and purchase history</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {(() => {
                    // Aggregate customer data from orders
                    const customerMap = new Map<string, any>();
                    
                    orders.forEach(order => {
                      const phone = order.customerPhone;
                      if (!customerMap.has(phone)) {
                        customerMap.set(phone, {
                          name: order.customerName,
                          phone: order.customerPhone,
                          orderCount: 0,
                          totalSpent: 0,
                          lastOrder: order.createdAt
                        });
                      }
                      
                      const customer = customerMap.get(phone);
                      customer.orderCount += 1;
                      customer.totalSpent += order.total;
                      if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
                        customer.lastOrder = order.createdAt;
                      }
                    });

                    const customers = Array.from(customerMap.values());

                    return (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Customer Name</TableHead>
                              <TableHead>Phone Number</TableHead>
                              <TableHead className="text-center">Total Orders</TableHead>
                              <TableHead className="text-right">Total Spent</TableHead>
                              <TableHead>Last Order</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                  No customer data available.
                                </TableCell>
                              </TableRow>
                            ) : (
                              customers.map((customer) => (
                                <TableRow key={customer.phone} className="hover:bg-muted/50 transition-colors">
                                  <TableCell className="font-medium text-foreground">
                                    {customer.name}
                                  </TableCell>
                                  <TableCell>
                                    {customer.phone}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold">
                                    {customer.orderCount}
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-primary">
                                    ₹{customer.totalSpent}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">
                                    {new Date(customer.lastOrder).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menu">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-card pb-4">
                  <div>
                    <CardTitle>Manage Menu Items</CardTitle>
                    <CardDescription>Add, update or remove items from the restaurant menu</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search menu..."
                        className="pl-9 w-full"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                      />
                    </div>
                    <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto" onClick={() => {
                          setEditingItem(null);
                          setMenuFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: 'breakfast',
                            image: '/images/hero-food.jpg',
                            available: true,
                          });
                        }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                          <DialogDescription>
                            Enter the details of the food item below.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleMenuSubmit} className="space-y-4 pt-4">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Item Name</Label>
                              <Input 
                                id="name" 
                                value={menuFormData.name}
                                onChange={(e) => setMenuFormData({...menuFormData, name: e.target.value})}
                                placeholder="e.g. Masala Dosa" 
                                required 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input 
                                  id="price" 
                                  type="number"
                                  value={menuFormData.price}
                                  onChange={(e) => setMenuFormData({...menuFormData, price: e.target.value})}
                                  placeholder="50" 
                                  required 
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select 
                                  value={menuFormData.category} 
                                  onValueChange={(v) => setMenuFormData({...menuFormData, category: v})}
                                >
                                  <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="breakfast">Breakfast</SelectItem>
                                    <SelectItem value="snacks">Snacks</SelectItem>
                                    <SelectItem value="beverages">Beverages</SelectItem>
                                    <SelectItem value="meals">Meals</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea 
                                id="description" 
                                value={menuFormData.description}
                                onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})}
                                placeholder="Short description of the dish..." 
                                className="resize-none"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="image">Image Path</Label>
                              <Input 
                                id="image" 
                                value={menuFormData.image}
                                onChange={(e) => setMenuFormData({...menuFormData, image: e.target.value})}
                                placeholder="/images/dosa.png" 
                              />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <Label className="text-base">Available</Label>
                                <p className="text-sm text-muted-foreground">Is this item currently in stock?</p>
                              </div>
                              <Switch 
                                checked={menuFormData.available}
                                onCheckedChange={(v) => setMenuFormData({...menuFormData, available: v})}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsMenuDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingItem ? 'Save Changes' : 'Add Item'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                      const data = {
                        menuItems,
                        dailySpecials,
                        orders
                      };
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `project-backup-${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                      
                      toast({
                        title: "Backup Success",
                        description: "Your entire database has been exported successfully.",
                      });
                    }}>
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[80px]">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMenuItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                              No menu items found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMenuItems.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell>
                                <div className="h-10 w-10 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" onError={(e) => {
                                      (e.target as any).src = "https://placehold.co/400x400?text=Food";
                                    }} />
                                  ) : (
                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">{item.name}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">{item.category}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">₹{item.price}</TableCell>
                              <TableCell>
                                {item.available ? (
                                  <Badge className="bg-green-500">Available</Badge>
                                ) : (
                                  <Badge variant="secondary">Sold Out</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                                    if(confirm('Are you sure you want to delete this item?')) {
                                      removeMenuItem(item.id);
                                    }
                                  }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Specials Management */}
              <Card className="mt-8 shadow-sm">
                <CardHeader className="border-b bg-card pb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    <CardTitle>Daily Specials</CardTitle>
                  </div>
                  <CardDescription>Update today's featured offers and deals</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Prices</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailySpecials.map((special) => (
                        <TableRow key={special.id}>
                          <TableCell>
                            <div className="h-10 w-10 rounded-md overflow-hidden border">
                              <img src={special.image} alt={special.name} className="h-full w-full object-cover" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{special.name}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">₹{special.price}</span>
                              <span className="text-xs text-muted-foreground line-through">₹{special.originalPrice}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {special.available ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Paused</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openSpecialDialog(special)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Special Edit Dialog */}
              <Dialog open={isSpecialDialogOpen} onOpenChange={setIsSpecialDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Daily Special</DialogTitle>
                    <DialogDescription>
                      Update the featured offer details.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSpecialSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="s-name">Special Name</Label>
                        <Input 
                          id="s-name" 
                          value={specialFormData.name}
                          onChange={(e) => setSpecialFormData({...specialFormData, name: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="s-price">Offer Price (₹)</Label>
                          <Input 
                            id="s-price" 
                            type="number"
                            value={specialFormData.price}
                            onChange={(e) => setSpecialFormData({...specialFormData, price: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="s-orig">Original Price (₹)</Label>
                          <Input 
                            id="s-orig" 
                            type="number"
                            value={specialFormData.originalPrice}
                            onChange={(e) => setSpecialFormData({...specialFormData, originalPrice: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="s-desc">Description</Label>
                        <Textarea 
                          id="s-desc" 
                          value={specialFormData.description}
                          onChange={(e) => setSpecialFormData({...specialFormData, description: e.target.value})}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <Label className="text-base">Available</Label>
                          <p className="text-sm text-muted-foreground">Show this special on homepage?</p>
                        </div>
                        <Switch 
                          checked={specialFormData.available}
                          onCheckedChange={(v) => setSpecialFormData({...specialFormData, available: v})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsSpecialDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Special
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>



          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
