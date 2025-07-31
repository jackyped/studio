
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Loader2, PlusCircle, CheckCircle2, Eye, Car, User, FileText, Wallet, BarChart2 } from 'lucide-react';
import { driverFeedbackSummary } from '@/ai/flows/review-summary';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

type DriverStatus = 'Active' | 'Inactive' | 'Pending' | 'Rejected';
type PayoutStatus = 'Paid' | 'Pending' | 'Due';

type Driver = {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  rating: number;
  feedback: string;
  createdAt: string;
  avatarUrl: string;
  // New Fields
  vehicleType: 'Car' | 'Motorcycle' | 'Van';
  licensePlate: string;
  vehicleModel: string;
  totalEarnings: number;
  payoutStatus: PayoutStatus;
  totalDeliveries: number;
  acceptanceRate: number;
  onTimeRate: number;
  licenseDocId: string;
  registrationDocId: string;
};

const mockDrivers: Driver[] = [
    { id: 'DRV001', name: 'John Doe', phone: '+1-202-555-0104', status: 'Active', rating: 4.8, feedback: "John is always on time and very professional. The packages are always handled with care. Sometimes he seems to be in a rush, but overall a great driver.", createdAt: '2023-01-15', avatarUrl: 'https://placehold.co/100x100.png', vehicleType: 'Car', licensePlate: 'DRV-123', vehicleModel: 'Honda Civic', totalEarnings: 2500.75, payoutStatus: 'Paid', totalDeliveries: 120, acceptanceRate: 95, onTimeRate: 98, licenseDocId: 'FILE001', registrationDocId: 'FILE006' },
    { id: 'DRV002', name: 'Jane Smith', phone: '+1-202-555-0162', status: 'Active', rating: 4.5, feedback: "Jane is friendly but has been late a few times. The delivery ETA is not always accurate. She communicates well when she's running behind.", createdAt: '2023-02-20', avatarUrl: 'https://placehold.co/100x100.png', vehicleType: 'Motorcycle', licensePlate: 'DRV-456', vehicleModel: 'Yamaha NMAX', totalEarnings: 1800.50, payoutStatus: 'Pending', totalDeliveries: 85, acceptanceRate: 92, onTimeRate: 88, licenseDocId: 'FILE004', registrationDocId: 'FILE007' },
    { id: 'DRV003', name: 'Mike Ross', phone: '+1-202-555-0125', status: 'Inactive', rating: 3.2, feedback: "Mike often gets lost and has trouble finding the address. I've had to go out and meet him. He also delivered to the wrong house once.", createdAt: '2023-05-10', avatarUrl: 'https://placehold.co/100x100.png', vehicleType: 'Car', licensePlate: 'DRV-789', vehicleModel: 'Ford Focus', totalEarnings: 320.00, payoutStatus: 'Paid', totalDeliveries: 30, acceptanceRate: 70, onTimeRate: 65, licenseDocId: 'FILE008', registrationDocId: 'FILE009' },
    { id: 'DRV004', name: 'Rachel Zane', phone: '+1-202-555-0187', status: 'Pending', rating: 0, feedback: "", createdAt: '2024-03-01', avatarUrl: 'https://placehold.co/100x100.png', vehicleType: 'Car', licensePlate: 'DRV-101', vehicleModel: 'Tesla Model 3', totalEarnings: 0, payoutStatus: 'Pending', totalDeliveries: 0, acceptanceRate: 0, onTimeRate: 0, licenseDocId: 'FILE010', registrationDocId: 'FILE011' },
    { id: 'DRV005', name: 'Harvey Specter', phone: '+1-202-555-0199', status: 'Active', rating: 5.0, feedback: "Flawless delivery every time. Harvey is the best.", createdAt: '2022-11-25', avatarUrl: 'https://placehold.co/100x100.png', vehicleType: 'Car', licensePlate: 'DRV-212', vehicleModel: 'Mercedes S-Class', totalEarnings: 4500.00, payoutStatus: 'Paid', totalDeliveries: 250, acceptanceRate: 99, onTimeRate: 100, licenseDocId: 'FILE012', registrationDocId: 'FILE013' },
];


export function DriverManagement() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver> | null>(null);
  const [selectedDriverForSummary, setSelectedDriverForSummary] = useState<Driver | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewDetails = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDetailDialogOpen(true);
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
            avatarUrl: 'https://placehold.co/100x100.png',
            vehicleType: 'Car',
            licensePlate: currentDriver?.licensePlate || '',
            vehicleModel: currentDriver?.vehicleModel || '',
            totalEarnings: 0,
            payoutStatus: 'Pending',
            totalDeliveries: 0,
            acceptanceRate: 0,
            onTimeRate: 0,
            licenseDocId: '',
            registrationDocId: '',
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
            placeholder="Search drivers by name, phone, plate..."
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
              <TableHead>License Plate</TableHead>
              <TableHead>Total Deliveries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map(driver => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell><Badge variant="outline">{driver.licensePlate}</Badge></TableCell>
                <TableCell>{driver.totalDeliveries}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(driver.status)}>{driver.status}</Badge>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(driver)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenFormDialog(driver)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!driver.feedback}
                        onClick={() => handleOpenSummaryDialog(driver)}
                      >
                        Summarize Feedback
                      </DropdownMenuItem>
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

       <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentDriver?.id ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            <DialogDescription>
              {currentDriver?.id ? 'Update the details for this driver.' : 'Enter the details for the new driver.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={currentDriver?.name || ''} onChange={(e) => setCurrentDriver({...currentDriver, name: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={currentDriver?.phone || ''} onChange={(e) => setCurrentDriver({...currentDriver, phone: e.target.value})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              <Input id="vehicleModel" placeholder='e.g. Toyota Camry 2021' value={currentDriver?.vehicleModel || ''} onChange={(e) => setCurrentDriver({...currentDriver, vehicleModel: e.target.value})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input id="licensePlate" value={currentDriver?.licensePlate || ''} onChange={(e) => setCurrentDriver({...currentDriver, licensePlate: e.target.value})} />
            </div>
             {currentDriver?.id && (
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={currentDriver?.status} onValueChange={(value: DriverStatus) => setCurrentDriver({...currentDriver, status: value})}>
                        <SelectTrigger>
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

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              A complete overview of the driver's profile, performance, and documents.
            </DialogDescription>
          </DialogHeader>
          {currentDriver && (
            <Tabs defaultValue="profile" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
                    <TabsTrigger value="performance"><BarChart2 className="mr-2 h-4 w-4" />Performance</TabsTrigger>
                    <TabsTrigger value="documents"><FileText className="mr-2 h-4 w-4" />Documents</TabsTrigger>
                    <TabsTrigger value="earnings"><Wallet className="mr-2 h-4 w-4" />Earnings</TabsTrigger>
                </TabsList>
                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader className='flex flex-row items-center gap-4'>
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={currentDriver.avatarUrl} alt={currentDriver.name} />
                                    <AvatarFallback>{currentDriver.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{currentDriver.name}</CardTitle>
                                    <CardDescription>{currentDriver.phone}</CardDescription>
                                    <Badge variant={getStatusBadgeVariant(currentDriver.status as DriverStatus)} className="mt-2">{currentDriver.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2"><Car className="h-5 w-5 text-muted-foreground"/> Vehicle Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-semibold">Type:</span> {currentDriver.vehicleType}</div>
                                        <div><span className="font-semibold">Model:</span> {currentDriver.vehicleModel}</div>
                                        <div><span className="font-semibold">Plate:</span> <Badge variant="outline">{currentDriver.licensePlate}</Badge></div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">AI Feedback Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{summary || "No summary generated. Click 'Summarize Feedback' from the main menu."}</p>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="performance">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <Card><CardHeader><CardTitle>{currentDriver.totalDeliveries}</CardTitle><CardDescription>Total Deliveries</CardDescription></CardHeader></Card>
                            <Card><CardHeader><CardTitle>{currentDriver.acceptanceRate}%</CardTitle><CardDescription>Acceptance Rate</CardDescription></CardHeader></Card>
                            <Card><CardHeader><CardTitle>{currentDriver.onTimeRate}%</CardTitle><CardDescription>On-Time Rate</CardDescription></CardHeader></Card>
                            <Card><CardHeader><CardTitle>{currentDriver.rating}</CardTitle><CardDescription>Avg. Rating</CardDescription></CardHeader></Card>
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Raw Feedback</CardTitle></CardHeader>
                            <CardContent>
                                <Textarea readOnly value={currentDriver.feedback} className="bg-muted/50" rows={8} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="documents">
                        <Card>
                            <CardHeader><CardTitle>Associated Documents</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Document Type</TableHead><TableHead>File ID</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        <TableRow><TableCell>Driver's License</TableCell><TableCell>{currentDriver.licenseDocId || "N/A"}</TableCell><TableCell><Button variant="link" size="sm" asChild><Link href="/admin/system/files">View File</Link></Button></TableCell></TableRow>
                                        <TableRow><TableCell>Vehicle Registration</TableCell><TableCell>{currentDriver.registrationDocId || "N/A"}</TableCell><TableCell><Button variant="link" size="sm" asChild><Link href="/admin/system/files">View File</Link></Button></TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="earnings">
                        <div className="grid grid-cols-2 gap-4">
                            <Card><CardHeader><CardTitle>${currentDriver.totalEarnings?.toFixed(2)}</CardTitle><CardDescription>Total Earnings</CardDescription></CardHeader></Card>
                            <Card><CardHeader><CardTitle>{currentDriver.payoutStatus}</CardTitle><CardDescription>Payout Status</CardDescription></CardHeader></Card>
                        </div>
                        <div className="mt-4 text-center">
                            <Button asChild><Link href="/admin/finance/driver-revenue">Go to Full Financials</Link></Button>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
    </>
  );
}
