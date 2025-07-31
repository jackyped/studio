
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { User, Package, Truck, CheckCircle, AlertCircle, X, ChevronsRight } from 'lucide-react';

// --- Data copied from order-management.tsx for demonstration ---
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
    ]},
    { id: 'ORD002', customerName: 'Charlie Brown', pharmacyName: 'MediQuick Store', driverName: 'Jane Smith', status: 'Out for Delivery', total: 18.99, createdAt: '2024-03-15T11:00:00Z', items: [{id: 'PROD003', name: 'Cold-Ez Syrup', quantity: 1, price: 8.99, imageUrl: 'https://placehold.co/100x100.png'}], logs: [] },
];
// --- End of copied data ---

function FormattedDate({ dateString, includeTime = false }: { dateString: string | null; includeTime?: boolean }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (!dateString) {
            setFormattedDate('N/A');
            return;
        }
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


type CouponRecipientStatus = 'Redeemed' | 'Sent' | 'Expired';

type CouponRecipient = {
  id: string; // user id
  name: string;
  email: string;
  status: CouponRecipientStatus;
  usedAt: string | null;
  orderId: string | null;
};

type TrackedCouponDistribution = {
  distributionId: string;
  couponId: string;
  couponName: string;
  couponCode: string;
  distributedAt: string;
  recipients: CouponRecipient[];
};

const mockDistributions: TrackedCouponDistribution[] = [
    {
        distributionId: 'DIST001',
        couponId: 'PROMO001',
        couponName: '10% Off Welcome Offer',
        couponCode: 'WELCOME10',
        distributedAt: '2024-03-10T09:00:00Z',
        recipients: [
            { id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com', status: 'Redeemed', usedAt: '2024-03-15T10:30:00Z', orderId: 'ORD001' },
            { id: 'USR002', name: 'Bob Williams', email: 'bob@pharmacy.com', status: 'Sent', usedAt: null, orderId: null },
        ]
    },
    {
        distributionId: 'DIST002',
        couponId: 'PROMO002',
        couponName: '$5 Off $50',
        couponCode: 'SAVE5',
        distributedAt: '2024-03-12T14:00:00Z',
        recipients: [
            { id: 'USR005', name: 'Charlie Brown', email: 'charlie@example.com', status: 'Redeemed', usedAt: '2024-03-15T11:00:00Z', orderId: 'ORD002' },
            { id: 'DRV001', name: 'John Doe', email: 'john.d@driver.com', status: 'Sent', usedAt: null, orderId: null },
            { id: 'DRV002', name: 'Jane Smith', email: 'jane.s@driver.com', status: 'Expired', usedAt: null, orderId: null },
        ]
    }
];

export function CouponTracking() {
  const [selectedDistributionId, setSelectedDistributionId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const selectedDistribution = useMemo(() => {
    return mockDistributions.find(d => d.distributionId === selectedDistributionId) || null;
  }, [selectedDistributionId]);
  
  const handleViewOrder = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    }
  };

  const getStatusBadgeVariant = (status: CouponRecipientStatus) => {
    switch(status) {
        case 'Redeemed': return 'default';
        case 'Sent': return 'secondary';
        case 'Expired': return 'destructive';
        default: return 'outline';
    }
  }

  const getOrderStatusIcon = (status: OrderStatus) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Coupon Distribution Tracking</CardTitle>
        <CardDescription>Monitor the status and usage of your sent coupon campaigns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium">Select a Coupon Distribution</label>
            <Select onValueChange={setSelectedDistributionId} value={selectedDistributionId || ''}>
                <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Choose a coupon campaign..." />
                </SelectTrigger>
                <SelectContent>
                    {mockDistributions.map(d => (
                        <SelectItem key={d.distributionId} value={d.distributionId}>
                           {d.couponName} ({d.couponCode}) - Sent on <FormattedDate dateString={d.distributedAt} />
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {selectedDistribution ? (
             <div className="rounded-lg border mt-4">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Used At</TableHead>
                        <TableHead>Associated Order</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedDistribution.recipients.map(recipient => (
                    <TableRow key={recipient.id}>
                        <TableCell className="font-medium">
                            <div>{recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{recipient.email}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(recipient.status)}>{recipient.status}</Badge>
                        </TableCell>
                        <TableCell><FormattedDate dateString={recipient.usedAt} includeTime /></TableCell>
                        <TableCell>
                            {recipient.orderId ? (
                                <Button variant="link" className="p-0 h-auto" onClick={() => handleViewOrder(recipient.orderId!)}>
                                    {recipient.orderId}
                                </Button>
                            ) : 'N/A'}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        ) : (
            <div className="mt-4 border rounded-lg p-8 text-center border-dashed">
                <p className="text-muted-foreground">Please select a coupon distribution to view its tracking details.</p>
            </div>
        )}
      </CardContent>
    </Card>

    {/* Order Detail Dialog */}
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Read-only view of order placed by {selectedOrder?.customerName} on {selectedOrder && <FormattedDate dateString={selectedOrder.createdAt} includeTime />}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card><CardContent className="pt-6"><h3 className="font-semibold">Customer</h3><p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p></CardContent></Card>
                    <Card><CardContent className="pt-6"><h3 className="font-semibold">Pharmacy</h3><p className="text-sm text-muted-foreground">{selectedOrder.pharmacyName}</p></CardContent></Card>
                    <Card><CardContent className="pt-6"><h3 className="font-semibold">Driver</h3><p className="text-sm text-muted-foreground">{selectedOrder.driverName || 'Not Assigned'}</p></CardContent></Card>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow><TableHead>Item</TableHead><TableHead>Quantity</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Subtotal</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedOrder.items.length > 0 ? selectedOrder.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell><div className="flex items-center gap-3"><Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint="medicine product" /><span>{item.name}</span></div></TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                                )) : <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No items in this order.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Order History & Logs</h3>
                    <Card>
                        <CardContent className="pt-6">
                            {selectedOrder.logs.length > 0 ? (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                                    {selectedOrder.logs.map((log) => (
                                        <div key={log.id} className="relative mb-6">
                                            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-primary -translate-x-1/2" />
                                            <div className="pl-2">
                                                <div className="flex items-center gap-2"><p className="font-semibold">{log.action}</p><span className="text-xs text-muted-foreground"><FormattedDate dateString={log.timestamp} includeTime /></span></div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><User className="h-3 w-3" /><span>by {log.user}</span></div>
                                                <p className="text-sm mt-1">{log.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-center text-muted-foreground">No operation logs found for this order.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
