
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PharmacyStatus = 'Active' | 'Inactive' | 'Pending' | 'Rejected';

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: PharmacyStatus;
  createdAt: string;
};

const mockPharmacies: Pharmacy[] = [
    { id: 'PHM001', name: 'GoodHealth Pharmacy', address: '123 Health St, Wellness City', phone: '+1-202-555-0134', status: 'Active', createdAt: '2023-08-11' },
    { id: 'PHM002', name: 'MediQuick Store', address: '456 Cure Ave, Medtown', phone: '+1-202-555-0178', status: 'Pending', createdAt: '2024-02-28' },
    { id: 'PHM003', name: 'The Corner Drugstore', address: '789 Pill Ln, Suburbia', phone: '+1-202-555-0191', status: 'Active', createdAt: '2022-11-01' },
    { id: 'PHM004', name: 'City Central Pharma', address: '101 Downtown Blvd, Metroville', phone: '+1-202-555-0122', status: 'Inactive', createdAt: '2023-03-19' },
    { id: 'PHM005', name: 'Wellness Rx', address: '222 Vita Rd, Healthville', phone: '+1-202-555-0145', status: 'Rejected', createdAt: '2024-01-05' },
    { id: 'PHM006', name: 'NewHope Medical Supplies', address: '333 Hopeful Way, Townsville', phone: '+1-202-555-0156', status: 'Pending', createdAt: '2024-03-10' },
];

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}

export function PharmacyManagement() {
  const [pharmacies, setPharmacies] = useState(mockPharmacies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentPharmacy, setCurrentPharmacy] = useState<Partial<Pharmacy> | null>(null);
  const { toast } = useToast();

  const filteredPharmacies = useMemo(() => {
    let filtered = pharmacies;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(pharmacy => pharmacy.status === statusFilter);
    }
    if (searchTerm) {
        filtered = filtered.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [searchTerm, pharmacies, statusFilter]);

  const handleOpenFormDialog = (pharmacy?: Pharmacy) => {
    setCurrentPharmacy(pharmacy || {});
    setIsFormDialogOpen(true);
  };

  const handleSavePharmacy = () => {
    if (currentPharmacy?.id) {
        setPharmacies(pharmacies.map(p => p.id === currentPharmacy.id ? { ...p, ...currentPharmacy } as Pharmacy : p));
        toast({ title: "Pharmacy Updated", description: `Details for ${currentPharmacy.name} have been updated.` });
    } else {
        const newPharmacy: Pharmacy = {
            id: `PHM${String(pharmacies.length + 1).padStart(3, '0')}`,
            name: currentPharmacy?.name || '',
            address: currentPharmacy?.address || '',
            phone: currentPharmacy?.phone || '',
            status: 'Pending',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setPharmacies([...pharmacies, newPharmacy]);
        toast({ title: "Pharmacy Added", description: `${newPharmacy.name} has been added and is pending approval.` });
    }
    setIsFormDialogOpen(false);
    setCurrentPharmacy(null);
  };

  const handleDeletePharmacy = (pharmacyId: string) => {
    setPharmacies(pharmacies.filter(p => p.id !== pharmacyId));
    toast({ variant: "destructive", title: "Pharmacy Deleted", description: "The pharmacy has been permanently deleted." });
  };
  
  const handleApprovePharmacy = (pharmacyId: string) => {
    setPharmacies(pharmacies.map(p => p.id === pharmacyId ? {...p, status: 'Active'} : p));
    toast({ title: "Pharmacy Approved", description: "The pharmacy has been approved and is now active." });
  }
  
  const getStatusBadgeVariant = (status: Pharmacy['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Inactive': return 'outline';
      case 'Rejected': return 'destructive';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenFormDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Pharmacy
        </Button>
      </div>

       <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-4">
            <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
      </Tabs>

      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPharmacies.map(pharmacy => (
              <TableRow key={pharmacy.id}>
                <TableCell className="font-medium">{pharmacy.name}</TableCell>
                <TableCell>{pharmacy.address}</TableCell>
                <TableCell>{pharmacy.phone}</TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(pharmacy.status)}>{pharmacy.status}</Badge></TableCell>
                <TableCell><FormattedDate dateString={pharmacy.createdAt} /></TableCell>
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
                      {pharmacy.status === 'Pending' && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <CheckCircle2 className="mr-2 h-4 w-4"/>
                                    Approve
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Pharmacy?</AlertDialogTitle>
                                    <AlertDialogDescription>This will mark the pharmacy as active and allow them to operate on the platform. Are you sure?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleApprovePharmacy(pharmacy.id)}>Approve</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <DropdownMenuItem onClick={() => handleOpenFormDialog(pharmacy)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
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
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the pharmacy account.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePharmacy(pharmacy.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{currentPharmacy?.id ? 'Edit Pharmacy' : 'Add New Pharmacy'}</DialogTitle>
            <DialogDescription>
              {currentPharmacy?.id ? 'Update the details for this pharmacy.' : 'Enter the details for the new pharmacy.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentPharmacy?.name || ''} onChange={(e) => setCurrentPharmacy({...currentPharmacy, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={currentPharmacy?.address || ''} onChange={(e) => setCurrentPharmacy({...currentPharmacy, address: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={currentPharmacy?.phone || ''} onChange={(e) => setCurrentPharmacy({...currentPharmacy, phone: e.target.value})} className="col-span-3" />
            </div>
             {currentPharmacy?.id && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={currentPharmacy?.status} onValueChange={(value: PharmacyStatus) => setCurrentPharmacy({...currentPharmacy, status: value})}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                             <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSavePharmacy}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
