"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type RecipientStatus = 'Sent' | 'Failed' | 'Opened' | 'Pending';

type Recipient = {
  id: string;
  name: string;
  contact: string;
  channel: 'Email' | 'SMS';
  status: RecipientStatus;
  statusAt: string;
};

type TrackedNotification = {
  id: string;
  title: string;
  sentAt: string;
  recipients: Recipient[];
};

const mockTrackedNotifications: TrackedNotification[] = [
    {
        id: 'NTF001',
        title: 'Scheduled Maintenance Downtime',
        sentAt: '2024-03-11T10:00:00Z',
        recipients: [
            { id: 'USR001', name: 'Alice Johnson', contact: 'alice@example.com', channel: 'Email', status: 'Opened', statusAt: '2024-03-11T10:05:00Z' },
            { id: 'DRV001', name: 'John Doe', contact: '+12025550104', channel: 'SMS', status: 'Sent', statusAt: '2024-03-11T10:01:00Z' },
            { id: 'PHM001', name: 'GoodHealth Pharmacy', contact: 'contact@goodhealth.com', channel: 'Email', status: 'Failed', statusAt: '2024-03-11T10:00:30Z' },
        ]
    },
    {
        id: 'NTF004',
        title: 'Your Order is Out for Delivery',
        sentAt: '2024-03-15T14:00:00Z',
        recipients: [
            { id: 'USR005', name: 'Charlie Brown', contact: 'charlie@example.com', channel: 'Email', status: 'Sent', statusAt: '2024-03-15T14:00:05Z' },
            { id: 'DRV002', name: 'Jane Smith', contact: '+12025550162', channel: 'SMS', status: 'Opened', statusAt: '2024-03-15T14:02:00Z' },
        ]
    }
];

export function NotificationTracking() {
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const { toast } = useToast();

  const selectedNotification = useMemo(() => {
    return mockTrackedNotifications.find(n => n.id === selectedNotificationId) || null;
  }, [selectedNotificationId]);
  
  const handleResend = (recipientId: string) => {
    toast({
        title: "Resending Notification",
        description: `A resend attempt for recipient ${recipientId} has been queued.`,
    })
  }

  const getStatusBadgeVariant = (status: RecipientStatus) => {
    switch(status) {
        case 'Sent': return 'secondary';
        case 'Opened': return 'default';
        case 'Failed': return 'destructive';
        case 'Pending': return 'outline';
        default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Delivery Tracking</CardTitle>
        <CardDescription>Monitor the status of your sent notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium">Select a Notification</label>
            <Select onValueChange={setSelectedNotificationId} value={selectedNotificationId || ''}>
                <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Choose a sent notification..." />
                </SelectTrigger>
                <SelectContent>
                    {mockTrackedNotifications.map(n => (
                        <SelectItem key={n.id} value={n.id}>
                           {n.title} - Sent on {new Date(n.sentAt).toLocaleDateString()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {selectedNotification ? (
             <div className="rounded-lg border mt-4">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedNotification.recipients.map(recipient => (
                    <TableRow key={recipient.id}>
                        <TableCell className="font-medium">
                            <div>{recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{recipient.contact}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                {recipient.channel === 'Email' ? <Mail className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                                <span>{recipient.channel}</span>
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(recipient.status)}>{recipient.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(recipient.statusAt).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                            {recipient.status === 'Failed' && (
                                <Button variant="outline" size="sm" onClick={() => handleResend(recipient.id)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Resend
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        ) : (
            <div className="mt-4 border rounded-lg p-8 text-center border-dashed">
                <p className="text-muted-foreground">Please select a notification to view its tracking details.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
