"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Loader2, PlusCircle, CheckCircle2 } from 'lucide-react';
import { driverFeedbackSummary } from '@/ai/flows/review-summary';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

type DriverStatus = 'Active' | 'Inactive' | 'Pending' | 'Rejected';

type Driver = {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  rating: number;
  feedback: string;
  createdAt: string;
};

const mockDrivers: Driver[] = [
    { id: 'DRV001', name: 'John Doe', phone: '+1-202-555-0104', status: 'Active', rating: 4.8, feedback: "John is always on time and very professional. The packages are always handled with care. Sometimes he seems to be in a rush, but overall a great driver.", createdAt: '2023-01-15' },
    { id: 'DRV002', name: 'Jane Smith', phone: '+1-202-555-0162', status: 'Active', rating: 4.5, feedback: "Jane is friendly but has been late a few times. The delivery ETA is not always accurate. She communicates well when she's running behind.", createdAt: '2023-02-20' },
    { id: 'DRV003', name: 'Mike Ross', phone: '+1-202-555-0125', status: 'Inactive', rating: 3.2, feedback: "Mike often gets lost and has trouble finding the address. I've had to go out and meet him. He also delivered to the wrong house once.", createdAt: '2023-05-10' },
    { id: 'DRV004', name: 'Rachel Zane', phone: '+1-202-555-0187', status: 'Pending', rating: 0, feedback: "", createdAt: '2024-03-01' },
    { id: 'DRV005', name: 'Harvey Specter', phone: '+1-202-555-0199', status: 'Active', rating: 5.0, feedback: "Flawless delivery every time. Harvey is the best.", createdAt: '2022-11-25' },
    { id: 'DRV006', name: 'Donna Paulsen', phone: '+1-202-555-0111', status: 'Rejected', rating: 0, feedback: "Failed background check.", createdAt: '2024-03-05' },
    { id: 'DRV007', name: 'Louis Litt', phone: '+1-202-555-0155', status: 'Pending', rating: 0, feedback: "", createdAt: '2024-03-12' },
];

export function DriverManagement() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver> | null>(null);
  const [selectedDriverForSummary, setSelectedDriverForSummary] = useState<Driver | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm)
    );
  }, [searchTerm, drivers]);

  const handleOpenSummaryDialog = (driver: Driver) => {
    setSelectedDriverForSummary(driver);
    setSummary('');
    setIsSummaryDialogOpen(true);
  };
  
  const handleOpenFormDialog = (driver?: Driver) => {
    setCurrentDriver(driver || {});
    setIsFormDialogOpen(true);
  };

  const handleGenerateSummary = async () => {
    if (!selectedDriverForSummary || !selectedDriverForSummary.feedback) return;
    setIsLoadingSummary(true);
    try {
      const result = await driverFeedbackSummary({ feedback: selectedDriverForSummary.feedback });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate feedback summary. Please try again.',
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleSaveDriver = () => {
    if (currentDriver?.id) {
        setDrivers(drivers.map(d => d.id === currentDriver.id ? { ...d, ...currentDriver } as Driver : d));
        toast({ title: "Driver Updated", description: `Details for ${currentDriver.name} have been updated.` });
    } else {
        const newDriver: Driver = {
            id: `DRV${String(drivers.length + 1).padStart(3, '0')}`,
            name: currentDriver?.name || '',
            phone: currentDriver?.phone || '',
            status: 'Pending',
            rating: 0,
            feedback: '',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setDrivers([...drivers, newDriver]);
        toast({ title: "Driver Added", description: `${newDriver.name} has been added and is pending approval.` });
    }
    setIsFormDialogOpen(false);
    setCurrentDriver(null);
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    toast({ variant: "destructive", title: "Driver Deleted", description: "The driver has been permanently deleted." });
  };
  
  const handleApproveDriver = (driverId: string) => {
    setDrivers(drivers.map(d => d.id === driverId ? {...d, status: 'Active'} : d));
    toast({ title: "Driver Approved", description: "The driver has been approved and is now active." });
  };

  const getStatusBadgeVariant = (status: Driver['status']) => {
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
            placeholder="Search drivers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenFormDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Driver
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map(driver => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(driver.status)}>{driver.status}</Badge>
                </TableCell>
                <TableCell>{new Date(driver.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{driver.rating > 0 ? driver.rating.toFixed(1) : 'N/A'}</TableCell>
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
                      {driver.status === 'Pending' && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <CheckCircle2 className="mr-2 h-4 w-4"/>
                                    Approve
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Driver?</AlertDialogTitle>
                                    <AlertDialogDescription>This will mark the driver as active and allow them to start deliveries. Are you sure?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleApproveDriver(driver.id)}>Approve</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <DropdownMenuItem onClick={() => handleOpenFormDialog(driver)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!driver.feedback}
                        onClick={() => handleOpenSummaryDialog(driver)}
                      >
                        Summarize Feedback
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the driver account.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDriver(driver.id)}>Delete</AlertDialogAction>
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

      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Feedback Summary for {selectedDriverForSummary?.name}</DialogTitle>
            <DialogDescription>
              Generate an AI-powered summary of user feedback to identify areas for improvement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <h4 className="text-sm font-medium">Original Feedback</h4>
            <Textarea
              readOnly
              value={selectedDriverForSummary?.feedback}
              className="h-32 bg-muted/50"
            />
            {isLoadingSummary ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : summary ? (
              <div className="p-3 bg-muted rounded-md border">
                <h4 className="font-semibold mb-2">AI Summary:</h4>
                <p className="text-sm text-muted-foreground">{summary}</p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateSummary} disabled={isLoadingSummary || !selectedDriverForSummary?.feedback}>
              {isLoadingSummary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentDriver?.id ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            <DialogDescription>
              {currentDriver?.id ? 'Update the details for this driver.' : 'Enter the details for the new driver.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentDriver?.name || ''} onChange={(e) => setCurrentDriver({...currentDriver, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={currentDriver?.phone || ''} onChange={(e) => setCurrentDriver({...currentDriver, phone: e.target.value})} className="col-span-3" />
            </div>
             {currentDriver?.id && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={currentDriver?.status} onValueChange={(value: DriverStatus) => setCurrentDriver({...currentDriver, status: value})}>
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
            <Button onClick={handleSaveDriver}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
