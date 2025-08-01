
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
import { Search, MoreHorizontal, PlusCircle, Eye, UserPlus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, CheckCircle, Trash2, Pencil, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';


type UserRole = 'Customer' | 'Pharmacy' | 'Driver' | 'Admin';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
};

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}

const PAGE_SIZE = 10;

export function PharmacyUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users?role=pharmacies');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch pharmacy users.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    fetchUsers();
  }, [toast]);


  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (statusFilter !== 'All') {
        filtered = filtered.filter(user => user.status === statusFilter);
    }
    if (searchTerm) {
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filtered;
  }, [searchTerm, users, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const handleUpdateStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({ title: 'Status Updated', description: `User status has been updated to ${newStatus}.` });
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ variant: "destructive", title: "User Deleted", description: "The user has been permanently deleted." });
  }

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser: User = {
        id: `USR${String(users.length + 1 + 20).padStart(3, '0')}`,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: 'Pharmacy',
        status: 'Pending',
        createdAt: new Date().toISOString().split('T')[0],
        avatarUrl: 'https://placehold.co/100x100.png'
    };
    setUsers([newUser, ...users]);
    setIsAddUserDialogOpen(false);
    toast({
        title: "User Created",
        description: "The new pharmacy user has been successfully created and is pending approval.",
    });
  };

  const handleActivateAll = () => {
    setUsers(users.map(u => u.status === 'Inactive' ? { ...u, status: 'Active' } : u));
    toast({ title: 'All Users Activated', description: 'All inactive users have been set to active.' });
  }

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'destructive';
      case 'Pending': return 'secondary';
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
            onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
            {statusFilter === 'Inactive' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline"><CheckCircle className="mr-2 h-4 w-4" />Activate All Users</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action will activate all currently visible inactive users. This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleActivateAll}>Confirm & Activate</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Pharmacy
            </Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={(value) => {setStatusFilter(value); setCurrentPage(1);}} className="mt-4">
            <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
            </TabsList>
      </Tabs>

      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                Array.from({length: 5}).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div>{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.id}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                           <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator/>
                       {user.status === 'Active' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><UserCog className="mr-2 h-4 w-4" />Set Inactive</DropdownMenuItem></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Set User to Inactive?</AlertDialogTitle><AlertDialogDescription>This will temporarily disable the user's account. Are you sure?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateStatus(user.id, 'Inactive')}>Set Inactive</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {user.status === 'Inactive' && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><UserCog className="mr-2 h-4 w-4" />Set Active</DropdownMenuItem></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Set User to Active?</AlertDialogTitle><AlertDialogDescription>This will re-enable the user's account. Are you sure?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateStatus(user.id, 'Active')}>Set Active</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {user.status === 'Pending' && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><CheckCircle className="mr-2 h-4 w-4" />Approve</DropdownMenuItem></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Approve this Pharmacy?</AlertDialogTitle><AlertDialogDescription>This will mark the user as Active. Are you sure?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateStatus(user.id, 'Active')}>Approve</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
             {paginatedUsers.length === 0 && !isLoading && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No results found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
            </div>
        </div>

       <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Pharmacy</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new pharmacy account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g. GoodHealth Pharmacy" required />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g. contact@goodhealth.com" required />
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
                      Create Pharmacy
                  </Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
