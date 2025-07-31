
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, Edit, Trash2, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type NotificationStatus = 'Draft' | 'Published' | 'Archived';
type NotificationAudience = 'All Users' | 'Customers' | 'Drivers' | 'Pharmacies' | 'Specific Users';

type Notification = {
  id: string;
  title: string;
  content: string;
  status: NotificationStatus;
  audience: NotificationAudience;
  createdAt: string;
  updatedAt: string;
};

const mockNotifications: Notification[] = [
  { id: 'NTF001', title: 'Scheduled Maintenance Downtime', content: 'Our platform will be down for scheduled maintenance on Sunday at 2 AM for approximately 1 hour.', status: 'Published', audience: 'All Users', createdAt: '2024-03-10', updatedAt: '2024-03-11' },
  { id: 'NTF002', title: 'New Feature: Faster Checkout', content: 'We have launched a new feature that will make your checkout process faster and smoother. Check it out now!', status: 'Draft', audience: 'Customers', createdAt: '2024-03-12', updatedAt: '2024-03-12' },
  { id: 'NTF003', title: 'Holiday Delivery Schedule', content: 'Please be aware of the updated delivery schedule for the upcoming holiday season to avoid delays.', status: 'Draft', audience: 'Drivers', createdAt: '2024-03-01', updatedAt: '2024-03-05' },
];

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}

export function NotificationCreation() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Partial<Notification> | null>(null);
  const { toast } = useToast();

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, notifications]);

  const handleOpenForm = (notification?: Notification) => {
    setCurrentNotification(notification || {});
    setIsFormOpen(true);
  };
  
  const handleSaveNotification = () => {
    if (currentNotification?.id) {
        setNotifications(notifications.map(n => n.id === currentNotification.id ? { ...n, ...currentNotification, updatedAt: new Date().toISOString().split('T')[0] } as Notification : n));
        toast({ title: "Notification Updated", description: `Notification "${currentNotification.title}" has been updated.` });
    } else {
        const newNotification: Notification = {
            id: `NTF${String(notifications.length + 1).padStart(3, '0')}`,
            title: currentNotification?.title || 'Untitled Notification',
            content: currentNotification?.content || '',
            status: 'Draft',
            audience: currentNotification?.audience || 'All Users',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };
        setNotifications([newNotification, ...notifications]);
        toast({ title: "Notification Created", description: `Notification "${newNotification.title}" has been saved as a draft.` });
    }
    setIsFormOpen(false);
    setCurrentNotification(null);
  };
  
  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast({ variant: "destructive", title: "Notification Deleted", description: "The notification has been permanently deleted." });
  };
  
  const getStatusBadgeVariant = (status: NotificationStatus) => {
    switch(status) {
        case 'Published': return 'default';
        case 'Draft': return 'secondary';
        case 'Archived': return 'outline';
        default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Notification
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Target Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.map(notification => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">
                    {notification.title}
                </TableCell>
                <TableCell><Badge variant="outline">{notification.audience}</Badge></TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(notification.status)}>{notification.status}</Badge></TableCell>
                <TableCell><FormattedDate dateString={notification.updatedAt} /></TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenForm(notification)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                       <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" /> Go to Publish
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete this notification draft.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNotification(notification.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentNotification?.id ? 'Edit Notification' : 'Create New Notification'}</DialogTitle>
            <DialogDescription>
                Author the content for your notification. You can publish it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input id="title" placeholder="e.g. Important Platform Update" value={currentNotification?.title || ''} onChange={(e) => setCurrentNotification({...currentNotification, title: e.target.value})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={currentNotification?.audience} onValueChange={(value: NotificationAudience) => setCurrentNotification({...currentNotification, audience: value})}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select an audience" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Customers">Customers</SelectItem>
                      <SelectItem value="Drivers">Drivers</SelectItem>
                      <SelectItem value="Pharmacies">Pharmacies</SelectItem>
                      <SelectItem value="Specific Users" disabled>Specific Users (coming soon)</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={10} placeholder="Enter the main body of your notification here..." value={currentNotification?.content || ''} onChange={(e) => setCurrentNotification({...currentNotification, content: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveNotification}>Save as Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
