"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'Customer' | 'Pharmacy' | 'Driver' | 'Admin';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

const mockUsers: User[] = [
    { id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Customer', status: 'Active', createdAt: '2023-10-26' },
    { id: 'USR002', name: 'Bob Williams', email: 'bob@pharmacy.com', role: 'Pharmacy', status: 'Active', createdAt: '2023-09-15' },
    { id: 'USR003', name: 'John Doe', email: 'john.d@example.com', role: 'Driver', status: 'Active', createdAt: '2023-05-20' },
    { id: 'USR004', name: 'Admin User', email: 'admin@medichain.com', role: 'Admin', status: 'Active', createdAt: '2023-01-01' },
    { id: 'USR005', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Customer', status: 'Inactive', createdAt: '2024-01-10' },
    { id: 'USR006', name: 'Diana Prince', email: 'diana@driver.com', role: 'Driver', status: 'Pending', createdAt: '2024-03-01' },
];

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);
  
  const handleOpenFormDialog = (user?: User) => {
    setCurrentUser(user || {});
    setIsFormDialogOpen(true);
  };

  const handleSaveUser = () => {
    // Simulate API call
    if (currentUser?.id) {
        // Update user
        setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } as User : u));
        toast({ title: "User Updated", description: `Details for ${currentUser.name} have been updated.` });
    } else {
        // Create new user
        const newUser: User = {
            id: `USR${String(users.length + 1).padStart(3, '0')}`,
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            role: currentUser?.role || 'Customer',
            status: 'Pending',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        toast({ title: "User Created", description: `${newUser.name} has been added.` });
    }
    setIsFormDialogOpen(false);
    setCurrentUser(null);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ variant: "destructive", title: "User Deleted", description: "The user has been permanently deleted." });
  }

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
        <Button onClick={() => handleOpenFormDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
        </Button>
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
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenFormDialog(user)}>Edit</DropdownMenuItem>
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {currentUser?.id ? 'Update the details for this user.' : 'Enter the details for the new user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentUser?.name || ''} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={currentUser?.email || ''} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select value={currentUser?.role} onValueChange={(value: UserRole) => setCurrentUser({...currentUser, role: value})}>
                    <SelectTrigger className="col-span-3">
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
             {currentUser?.id && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={currentUser?.status} onValueChange={(value: UserStatus) => setCurrentUser({...currentUser, status: value})}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
