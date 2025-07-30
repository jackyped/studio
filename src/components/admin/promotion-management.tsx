"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PromotionType = 'Percentage' | 'Fixed Amount' | 'Free Shipping';
type PromotionStatus = 'Active' | 'Inactive' | 'Scheduled' | 'Expired';

type Promotion = {
  id: string;
  name: string;
  code: string;
  type: PromotionType;
  value: number;
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
};

const mockPromotions: Promotion[] = [
  { id: 'PROMO001', name: '10% Off Welcome Offer', code: 'WELCOME10', type: 'Percentage', value: 10, minSpend: 0, usageCount: 150, usageLimit: 1000, status: 'Active', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 'PROMO002', name: '$5 Off $50', code: 'SAVE5', type: 'Fixed Amount', value: 5, minSpend: 50, usageCount: 320, usageLimit: 5000, status: 'Active', startDate: '2024-03-01', endDate: '2024-03-31' },
  { id: 'PROMO003', name: 'Free Shipping Weekend', code: 'FREESHIP', type: 'Free Shipping', value: 0, minSpend: 25, usageCount: 88, usageLimit: 200, status: 'Expired', startDate: '2024-03-09', endDate: '2024-03-10' },
  { id: 'PROMO004', name: 'Spring Sale 15% Off', code: 'SPRING15', type: 'Percentage', value: 15, minSpend: 40, usageCount: 0, usageLimit: 1000, status: 'Scheduled', startDate: '2024-04-01', endDate: '2024-04-15' },
  { id: 'PROMO005', name: 'First Order Discount', code: 'NEWBIE', type: 'Fixed Amount', value: 10, minSpend: 20, usageCount: 45, usageLimit: -1, status: 'Inactive', startDate: '2023-01-01', endDate: '2024-12-31' },
];


export function PromotionManagement() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion> | null>(null);
  const { toast } = useToast();

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo =>
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, promotions]);

  const handleOpenForm = (promotion?: Promotion) => {
    setCurrentPromotion(promotion || {});
    setIsFormOpen(true);
  };
  
  const handleSavePromotion = () => {
    // This is where you would normally have an API call
    if (currentPromotion?.id) {
        setPromotions(promotions.map(p => p.id === currentPromotion.id ? { ...p, ...currentPromotion } as Promotion : p));
        toast({ title: "Promotion Updated", description: `Details for ${currentPromotion.name} have been updated.` });
    } else {
        const newPromotion: Promotion = {
            id: `PROMO${String(promotions.length + 1).padStart(3, '0')}`,
            name: currentPromotion?.name || 'New Promotion',
            code: currentPromotion?.code || 'NEWPROMO',
            type: currentPromotion?.type || 'Percentage',
            value: currentPromotion?.value || 0,
            minSpend: currentPromotion?.minSpend || 0,
            usageCount: 0,
            usageLimit: currentPromotion?.usageLimit || 1000,
            status: 'Scheduled',
            startDate: currentPromotion?.startDate || new Date().toISOString().split('T')[0],
            endDate: currentPromotion?.endDate || new Date().toISOString().split('T')[0],
        };
        setPromotions([newPromotion, ...promotions]);
        toast({ title: "Promotion Added", description: `${newPromotion.name} has been created and is scheduled.` });
    }
    setIsFormOpen(false);
    setCurrentPromotion(null);
  };
  
  const handleDeletePromotion = (promoId: string) => {
    setPromotions(promotions.filter(p => p.id !== promoId));
    toast({ variant: "destructive", title: "Promotion Deleted", description: "The promotion has been permanently deleted." });
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Promotion code copied to clipboard." });
  };

  const getStatusBadgeVariant = (status: PromotionStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Scheduled': return 'secondary';
      case 'Inactive': return 'outline';
      case 'Expired': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Promotion
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.map(promo => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{promo.code}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToClipboard(promo.code)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{promo.type}</TableCell>
                <TableCell>{promo.type === 'Percentage' ? `${promo.value}%` : promo.type === 'Fixed Amount' ? `$${promo.value.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>{promo.usageLimit < 0 ? `${promo.usageCount} / ∞` : `${promo.usageCount} / ${promo.usageLimit}`}</TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(promo.status)}>{promo.status}</Badge></TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenForm(promo)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the promotion.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePromotion(promo.id)}>Delete</AlertDialogAction>
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

      {/* Promotion Edit/Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentPromotion?.id ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
            <DialogDescription>
              {currentPromotion?.id ? 'Update the details for this promotion.' : 'Configure a new promotion for your customers.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-6">
            <div className="space-y-2">
              <Label htmlFor="name">Promotion Name</Label>
              <Input id="name" placeholder="e.g. Summer Sale" value={currentPromotion?.name || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Promotion Code</Label>
              <Input id="code" placeholder="e.g. SUMMER25" value={currentPromotion?.code || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, code: e.target.value.toUpperCase()})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
               <Select value={currentPromotion?.type} onValueChange={(value: PromotionType) => setCurrentPromotion({...currentPromotion, type: value})}>
                  <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Percentage">Percentage (%)</SelectItem>
                      <SelectItem value="Fixed Amount">Fixed Amount ($)</SelectItem>
                      <SelectItem value="Free Shipping">Free Shipping</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            {currentPromotion?.type !== 'Free Shipping' && (
                <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input id="value" type="number" value={currentPromotion?.value || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, value: parseFloat(e.target.value)})} />
                </div>
            )}
             <div className="space-y-2">
              <Label htmlFor="minSpend">Minimum Spend ($)</Label>
              <Input id="minSpend" type="number" value={currentPromotion?.minSpend || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, minSpend: parseFloat(e.target.value)})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input id="usageLimit" type="number" placeholder="-1 for unlimited" value={currentPromotion?.usageLimit || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, usageLimit: parseInt(e.target.value)})} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" value={currentPromotion?.startDate || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" value={currentPromotion?.endDate || ''} onChange={(e) => setCurrentPromotion({...currentPromotion, endDate: e.target.value})} />
                </div>
            </div>
            {currentPromotion?.id && (
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={currentPromotion?.status} onValueChange={(value: PromotionStatus) => setCurrentPromotion({...currentPromotion, status: value})}>
                        <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSavePromotion}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
