"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

  const selectedDistribution = useMemo(() => {
    return mockDistributions.find(d => d.distributionId === selectedDistributionId) || null;
  }, [selectedDistributionId]);
  
  const getStatusBadgeVariant = (status: CouponRecipientStatus) => {
    switch(status) {
        case 'Redeemed': return 'default';
        case 'Sent': return 'secondary';
        case 'Expired': return 'destructive';
        default: return 'outline';
    }
  }

  return (
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
                           {d.couponName} ({d.couponCode}) - Sent on {new Date(d.distributedAt).toLocaleDateString()}
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
                        <TableCell>{recipient.usedAt ? new Date(recipient.usedAt).toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>
                            {recipient.orderId ? (
                                <Button asChild variant="link" className="p-0 h-auto">
                                    <Link href={`/admin/orders?search=${recipient.orderId}`}>{recipient.orderId}</Link>
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
  )
}
