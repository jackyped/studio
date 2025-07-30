"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, CheckCircle2, XCircle, Archive, ArchiveRestore, History, Tag, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';

type ProductStatus = 'Approved' | 'Pending' | 'Rejected' | 'Shelved';
type ProductCategory = 'Cold & Flu' | 'Pain Relief' | 'Vitamins' | 'Prescription' | 'First Aid';

type Product = {
  id: string;
  name: string;
  pharmacyName: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
  description: string;
  usageInstructions: string;
  createdAt: string;
};

const mockProducts: Product[] = [
    { id: 'PROD001', name: 'Aspirin 500mg', pharmacyName: 'GoodHealth Pharmacy', category: 'Pain Relief', price: 5.99, stock: 150, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Effective pain reliever for headaches, muscle pain, and fever.', usageInstructions: 'Take 1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.', createdAt: '2023-11-10' },
    { id: 'PROD002', name: 'Vitamin C 1000mg', pharmacyName: 'Wellness Rx', category: 'Vitamins', price: 12.50, stock: 80, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'High-potency Vitamin C for immune support.', usageInstructions: 'Take one tablet daily with a meal.', createdAt: '2023-10-05' },
    { id: 'PROD003', name: 'Cold-Ez Syrup', pharmacyName: 'MediQuick Store', category: 'Cold & Flu', price: 8.99, stock: 0, status: 'Pending', imageUrl: 'https://placehold.co/100x100.png', description: 'Multi-symptom cold and flu relief for adults.', usageInstructions: '2 teaspoons every 6 hours.', createdAt: '2024-03-15' },
    { id: 'PROD004', name: 'Hydrocortisone Cream', pharmacyName: 'The Corner Drugstore', category: 'First Aid', price: 7.25, stock: 200, status: 'Shelved', imageUrl: 'https://placehold.co/100x100.png', description: 'Topical cream for itching and skin irritation.', usageInstructions: 'Apply a thin layer to affected area 2-3 times daily.', createdAt: '2023-01-20' },
    { id: 'PROD005', name: 'Amoxicillin 250mg', pharmacyName: 'City Central Pharma', category: 'Prescription', price: 15.00, stock: 55, status: 'Rejected', imageUrl: 'https://placehold.co/100x100.png', description: 'Antibiotic for bacterial infections. Requires prescription.', usageInstructions: 'As directed by your physician.', createdAt: '2024-03-01' },
];

export function ProductManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleOpenForm = (product?: Product) => {
    setCurrentProduct(product || {});
    setIsFormOpen(true);
  };
  
  const handleSaveProduct = () => {
    // This is where you would normally have an API call
    if (currentProduct?.id) {
        setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...currentProduct } as Product : p));
        toast({ title: "Product Updated", description: `Details for ${currentProduct.name} have been updated.` });
    } else {
        const newProduct: Product = {
            id: `PROD${String(products.length + 1).padStart(3, '0')}`,
            name: currentProduct?.name || 'New Product',
            pharmacyName: 'Platform-Managed',
            category: 'Pain Relief',
            price: 0,
            stock: 0,
            status: 'Pending',
            imageUrl: 'https://placehold.co/100x100.png',
            description: '',
            usageInstructions: '',
            createdAt: new Date().toISOString().split('T')[0],
            ...currentProduct
        };
        setProducts([newProduct, ...products]);
        toast({ title: "Product Added", description: `${newProduct.name} has been added and is pending approval.` });
    }
    setIsFormOpen(false);
    setCurrentProduct(null);
  };

  const handleUpdateStatus = (productId: string, status: ProductStatus) => {
    setProducts(products.map(p => p.id === productId ? { ...p, status } : p));
    toast({ title: "Status Updated", description: `Product has been ${status.toLowerCase()}.` });
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ variant: "destructive", title: "Product Deleted", description: "The product has been permanently deleted from the catalog." });
  };

  const getStatusBadgeVariant = (status: ProductStatus) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Shelved': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or pharmacy..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsCategoryManagerOpen(true)} className="flex-1 sm:flex-none">
              <Tag className="mr-2 h-4 w-4" />
              Manage Categories
          </Button>
          <Button onClick={() => handleOpenForm()} className="flex-1 sm:flex-none">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
          </Button>
        </div>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md" data-ai-hint="medicine product" />
                    <div className="flex flex-col">
                        <span className="font-semibold">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.pharmacyName}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.status)}>{product.status}</Badge>
                </TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
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
                      {product.status === 'Pending' && (
                        <>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(product.id, 'Approved')}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(product.id, 'Rejected')}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleOpenForm(product)}>Edit Details</DropdownMenuItem>
                       {product.status === 'Approved' && (
                         <DropdownMenuItem onClick={() => handleUpdateStatus(product.id, 'Shelved')}>
                           <Archive className="mr-2 h-4 w-4" /> Globally Shelf
                         </DropdownMenuItem>
                       )}
                       {product.status === 'Shelved' && (
                         <DropdownMenuItem onClick={() => handleUpdateStatus(product.id, 'Approved')}>
                           <ArchiveRestore className="mr-2 h-4 w-4" /> Restore Product
                         </DropdownMenuItem>
                       )}
                       <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
                         <History className="mr-2 h-4 w-4" /> View History
                       </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">Delete Product</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action is permanent and cannot be undone. This will delete the product from the global catalog.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
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

      {/* Product Edit/Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {currentProduct?.id ? 'Update the details for this product in the global catalog.' : 'Add a new product to the global catalog. It will be pending approval.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
               <Select value={currentProduct?.category} onValueChange={(value: ProductCategory) => setCurrentProduct({...currentProduct, category: value})}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Cold & Flu">Cold & Flu</SelectItem>
                      <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                      <SelectItem value="Vitamins">Vitamins</SelectItem>
                      <SelectItem value="Prescription">Prescription</SelectItem>
                      <SelectItem value="First Aid">First Aid</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" type="number" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usage" className="text-right">Usage Instructions</Label>
              <Textarea id="usage" value={currentProduct?.usageInstructions || ''} onChange={(e) => setCurrentProduct({...currentProduct, usageInstructions: e.target.value})} className="col-span-3" />
            </div>
            {currentProduct?.id && (
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={currentProduct?.status} onValueChange={(value: ProductStatus) => setCurrentProduct({...currentProduct, status: value})}>
                      <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                           <SelectItem value="Shelved">Shelved</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modification History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification History for {currentProduct?.name || 'Product'}</DialogTitle>
            <DialogDescription>Showing all recorded changes for this product.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">(Modification log feature not yet implemented)</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Manager Dialog */}
       <Dialog open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Category & Tag Management</DialogTitle>
            <DialogDescription>Manage global product categories and tags.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">(Category management feature not yet implemented)</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
