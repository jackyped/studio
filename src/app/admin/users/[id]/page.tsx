

"use client";

import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Mail, Phone, Calendar, DollarSign, Package, Shield, User, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

// Mock Data - In a real app, this would come from your API
type UserRole = 'Customer' | 'Pharmacy' | 'Driver' | 'Admin';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  totalSpent: number;
  totalOrders: number;
  lastLogin: string;
  avatarUrl: string;
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
]

// Helper function to get role icon
const getRoleIcon = (role: UserRole) => {
    switch (role) {
        case 'Admin': return <Shield className="h-4 w-4" />;
        case 'Customer': return <User className="h-4 w-4" />;
        case 'Driver': return <Truck className="h-4 w-4" />;
        case 'Pharmacy': return <Package className="h-4 w-4" />;
        default: return <User className="h-4 w-4" />;
    }
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);
  const userOrders = mockOrders.filter(o => o.customerId === params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight font-headline">User Details</h1>
       </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile */}
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>User's personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Role: <Badge variant="secondary">{user.role}</Badge></div>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Last Login: {user.lastLogin}</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage account status and actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Status</Label>
                        <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge>
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
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.totalOrders}</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
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
                                    <TableCell><Button variant="link" className="p-0 h-auto" asChild><Link href={`/admin/orders`}>{order.id}</Link></Button></TableCell>
                                    <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}>{order.status}</Badge></TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
    </div>
  );
}
