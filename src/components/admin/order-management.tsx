
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, AlertCircle, X, ChevronsRight, Package, Truck, CheckCircle, User, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

type OrderStatus = 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';

type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
};

type OrderLog = {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

type Order = {
  id: string;
  customerName: string;
  pharmacyName: string;
  driverName: string | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
  logs: OrderLog[];
};

const mockOrders: Order[] = [
    { id: 'ORD001', customerName: 'Alice Johnson', pharmacyName: 'GoodHealth Pharmacy', driverName: 'John Doe', status: 'Delivered', total: 45.50, createdAt: '2024-03-15T10:30:00Z', items: [{id: 'PROD001', name: 'Aspirin 500mg', quantity: 2, price: 5.99, imageUrl: 'https://placehold.co/100x100.png'}], logs: [
        { id: 'LOG001', timestamp: '2024-03-15T14:10:00Z', user: 'System', action: 'Order Delivered', details: 'Marked as delivered by driver John Doe.' },
        { id: 'LOG002', timestamp: '2024-03-15T11:05:00Z', user: 'System', action: 'Out for Delivery', details: 'Order assigned to driver John Doe.' },
        { id: 'LOG003', timestamp: '2024-03-15T10:35:00Z', user: 'Admin User', action: 'Order Processed', details: 'Pharmacy confirmed stock and processed the order.' },
        { id: 'LOG004', timestamp: '2024-03-15T10:30:00Z', user: 'Alice Johnson', action: 'Order Created', details: 'Order placed successfully.' },
    ]},
    { id: 'ORD002', customerName: 'Charlie Brown', pharmacyName: 'MediQuick Store', driverName: 'Jane Smith', status: 'Out for Delivery', total: 18.99, createdAt: '2024-03-15T11:00:00Z', items: [{id: 'PROD003', name: 'Cold-Ez Syrup', quantity: 1, price: 8.99, imageUrl: 'https://placehold.co/100x100.png'}], logs: [] },
    { id: 'ORD003', customerName: 'Bob Williams', pharmacyName: 'The Corner Drugstore', driverName: null, status: 'Processing', total: 75.20, createdAt: '2024-03-15T12:45:00Z', items: [{id: 'PROD002', name: 'Vitamin C 1000mg', quantity: 3, price: 12.50, imageUrl: 'https://placehold.co/100x100.png'}], logs: [] },
    { id: 'ORD004', customerName: 'Diana Prince', pharmacyName: 'GoodHealth Pharmacy', driverName: null, status: 'Pending', total: 22.75, createdAt: '2024-03-16T09:00:00Z', items: [], logs: [] },
    { id: 'ORD005', customerName: 'Alice Johnson', pharmacyName: 'City Central Pharma', driverName: 'Mike Ross', status: 'Cancelled', total: 35.00, createdAt: '2024-03-14T14:00:00Z', items: [], logs: [] },
    { id: 'ORD006', customerName: 'Eve Adams', pharmacyName: 'Wellness Rx', driverName: 'Harvey Specter', status: 'Refunded', total: 12.50, createdAt: '2024-03-13T16:20:00Z', items: [], logs: [] },
];

function FormattedDate({ dateString, includeTime = false }: { dateString: string; includeTime?: boolean }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        setFormattedDate(date.toLocaleString(undefined, options));
    }, [dateString, includeTime]);

    return <>{formattedDate}</>;
}


export function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [orders, searchTerm, statusFilter]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Out for Delivery': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'secondary';
      case 'Cancelled': return 'destructive';
      case 'Refunded': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch(status) {
        case 'Pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case 'Processing': return <ChevronsRight className="h-4 w-4 text-blue-500" />;
        case 'Out for Delivery': return <Truck className="h-4 w-4 text-orange-500" />;
        case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Cancelled': return <X className="h-4 w-4 text-red-500" />;
        case 'Refunded': return <X className="h-4 w-4 text-red-500" />;
        default: return <Package className="h-4 w-4" />;
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, Customer, or Pharmacy..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Processing">Processing</TabsTrigger>
                <TabsTrigger value="Out for Delivery">On Delivery</TabsTrigger>
                <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.pharmacyName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </Badge>
                </TableCell>
                <TableCell><FormattedDate dateString={order.createdAt} /></TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                   <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Viewing full details for order placed by {selectedOrder?.customerName} on {selectedOrder && <FormattedDate dateString={selectedOrder.createdAt} includeTime />}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold">Customer</h3>
                            <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold">Pharmacy</h3>
                            <p className="text-sm text-muted-foreground">{selectedOrder.pharmacyName}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold">Driver</h3>
                            <p className="text-sm text-muted-foreground">{selectedOrder.driverName || 'Not Assigned'}</p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedOrder.items.length > 0 ? selectedOrder.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint="medicine product" />
                                            <span>{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                                )) : (
                                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No items in this order.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <div className="text-right">
                            <p className="text-muted-foreground">Subtotal <span className="font-mono ml-4">${selectedOrder.total.toFixed(2)}</span></p>
                            <p className="text-muted-foreground">Delivery <span className="font-mono ml-4">$5.00</span></p>
                            <p className="font-bold">Total <span className="font-mono ml-4">${(selectedOrder.total + 5).toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Order History & Logs</h3>
                    <Card>
                        <CardContent className="pt-6">
                            {selectedOrder.logs.length > 0 ? (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                                    {selectedOrder.logs.map((log, index) => (
                                        <div key={log.id} className="relative mb-6">
                                            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-primary -translate-x-1/2" />
                                            <div className="pl-2">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{log.action}</p>
                                                    <span className="text-xs text-muted-foreground"><FormattedDate dateString={log.timestamp} includeTime /></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="h-3 w-3" />
                                                    <span>by {log.user}</span>
                                                </div>
                                                <p className="text-sm mt-1">{log.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-center text-muted-foreground">No operation logs found for this order.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            {selectedOrder?.status !== 'Cancelled' && selectedOrder?.status !== 'Refunded' && (
                <Button variant="destructive">Cancel Order</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
