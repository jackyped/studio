
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, Eye, UserPlus, Shield, User, Clock, Calendar, DollarSign, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';


type UserRole = 'Customer' | 'Pharmacy' | 'Driver' | 'Admin';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  totalSpent?: number;
  totalOrders?: number;
  lastLogin?: string;
  avatarUrl?: string;
};

const mockUsers: User[] = [
    { id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Customer', status: 'Active', createdAt: '2023-10-26', totalSpent: 1250.75, totalOrders: 15, lastLogin: '2024-03-15', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: 'USR002', name: 'Bob Williams', email: 'bob@pharmacy.com', role: 'Pharmacy', status: 'Active', createdAt: '2023-09-15', totalSpent: 0, totalOrders: 0, lastLogin: '2024-03-14', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: 'USR003', name: 'John Doe', email: 'john.d@example.com', role: 'Driver', status: 'Active', createdAt: '2023-05-20', totalSpent: 0, totalOrders: 0, lastLogin: '2024-03-16', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: 'USR004', name: 'Admin User', email: 'admin@medichain.com', role: 'Admin', status: 'Active', createdAt: '2023-01-01', totalSpent: 0, totalOrders: 0, lastLogin: '2024-03-16', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: 'USR005', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Customer', status: 'Inactive', createdAt: '2024-01-10', totalSpent: 50.20, totalOrders: 2, lastLogin: '2024-02-20', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: 'USR006', name: 'Diana Prince', email: 'diana@driver.com', role: 'Driver', status: 'Pending', createdAt: '2024-03-01', totalSpent: 0, totalOrders: 0, lastLogin: 'N/A', avatarUrl: 'https://placehold.co/100x100.png' },
];

const mockOrders = [
    { id: 'ORD001', customerId: 'USR001', status: 'Delivered', total: 45.50, createdAt: '2024-03-15'},
    { id: 'ORD005', customerId: 'USR001', status: 'Cancelled', total: 35.00, createdAt: '2024-03-14'},
    { id: 'ORD008', customerId: 'USR001', status: 'Delivered', total: 120.00, createdAt: '2024-03-10'},
];

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}


export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (statusFilter !== 'All') {
        filtered = filtered.filter(user => user.status === statusFilter);
    }
    return filtered.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users, statusFilter]);
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ variant: "destructive", title: "User Deleted", description: "The user has been permanently deleted." });
  }
  
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  }

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser: User = {
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as UserRole,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([newUser, ...users]);
    setIsAddUserDialogOpen(false);
    toast({
        title: "User Created",
        description: "The new user has been successfully created.",
    });
  };

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'destructive';
      case 'Pending': return 'secondary';
    }
  };
  
  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'Admin': return 'default';
      case 'Pharmacy': return 'secondary';
      default: return 'outline';
    }
  };
  
  const userOrders = selectedUser ? mockOrders.filter(o => o.customerId === selectedUser.id) : [];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </div>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge></TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                <TableCell><FormattedDate dateString={user.createdAt} /></TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the user account.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
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

       <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g. John Doe" required />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g. john.doe@example.com" required />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue="Customer">
                      <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Driver">Driver</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Create a strong password" required />
              </div>
               <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
                  </Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
                <DialogDescription>
                    Viewing full details for {selectedUser?.email}.
                </DialogDescription>
            </DialogHeader>
            {selectedUser && (
                <div className="grid gap-6 md:grid-cols-3 max-h-[70vh] overflow-y-auto p-1">
                    {/* Left Column - Profile */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>User's personal information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                                        <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Role: <Badge variant="secondary">{selectedUser.role}</Badge></div>
                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Joined: <FormattedDate dateString={selectedUser.createdAt} /></div>
                                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Last Login: {selectedUser.lastLogin}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Manage account status and actions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Status</Label>
                                    <Badge variant={selectedUser.status === 'Active' ? 'default' : 'destructive'}>{selectedUser.status}</Badge>
                                </div>
                                <Button className="w-full">Edit User</Button>
                                <Button variant="outline" className="w-full">Reset Password</Button>
                                <Button variant="destructive" className="w-full">Delete User</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Stats & History */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardDescription className="text-sm font-medium">Total Spent</CardDescription>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${(selectedUser.totalSpent || 0).toFixed(2)}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardDescription className="text-sm font-medium">Total Orders</CardDescription>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{selectedUser.totalOrders || 0}</div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardDescription>A list of the user's recent orders.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {userOrders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
                                                <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}>{order.status}</Badge></TableCell>
                                                <TableCell><FormattedDate dateString={order.createdAt} /></TableCell>
                                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                    ))}
                                    {userOrders.length === 0 && (
                                        <TableRow><TableCell colSpan={4} className="text-center">No orders found.</TableCell></TableRow>
                                    )}
                                    </TableBody>
                                </Table>
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
  );

    
