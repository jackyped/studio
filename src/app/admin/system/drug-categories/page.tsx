"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, CheckCircle2, XCircle, Archive, ArchiveRestore, History, Pill, User, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Tag, Sparkles, Loader2, Settings, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { generateProductDescription } from '@/ai/flows/pharmacy-product-descriptions';
import { Separator } from '@/components/ui/separator';

type ProductStatus = 'Approved' | 'Pending' | 'Rejected' | 'Shelved';

type Category = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
};


const mockCategories: Category[] = [
  { id: 'CAT001', name: 'Cold & Flu', description: 'Medications for treating symptoms of the common cold and influenza.', productCount: 15, createdAt: '2023-01-10' },
  { id: 'CAT002', name: 'Pain Relief', description: 'Analgesics for various types of pain, including headaches and muscle aches.', productCount: 22, createdAt: '2023-01-11' },
  { id: 'CAT003', name: 'Vitamins', description: 'Dietary supplements to support overall health and wellness.', productCount: 45, createdAt: '2023-01-12' },
  { id: 'CAT004', name: 'Prescription', description: 'Medications that require a doctor\'s prescription.', productCount: 120, createdAt: '2023-02-01' },
  { id: 'CAT005', name: 'First Aid', description: 'Supplies for treating minor injuries like cuts, scrapes, and burns.', productCount: 30, createdAt: '2023-02-05' },
];

type ModificationLog = {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
};

type Product = {
  id: string;
  name: string;
  pharmacyName: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
  description: string;
  usageInstructions: string;
  createdAt: string;
  logs: ModificationLog[];
};

const mockProducts: Product[] = [
    { id: 'PROD001', name: 'Aspirin 500mg', pharmacyName: 'GoodHealth Pharmacy', category: 'Pain Relief', price: 5.99, stock: 150, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Effective pain reliever for headaches, muscle pain, and fever.', usageInstructions: 'Take 1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.', createdAt: '2023-11-10', logs: [
        { id: 'LOG001', timestamp: '2024-03-01T10:00:00Z', user: 'Admin User', action: 'Price Update', details: 'Price changed from $5.49 to $5.99.' },
        { id: 'LOG002', timestamp: '2024-01-15T14:30:00Z', user: 'Admin User', action: 'Approved', details: 'Initial product submission was approved.' },
        { id: 'LOG003', timestamp: '2024-01-14T09:00:00Z', user: 'GoodHealth Pharmacy', action: 'Created', details: 'Product submitted for approval.' },
    ]},
    { id: 'PROD002', name: 'Vitamin C 1000mg', pharmacyName: 'Wellness Rx', category: 'Vitamins', price: 12.50, stock: 80, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'High-potency Vitamin C for immune support.', usageInstructions: 'Take one tablet daily with a meal.', createdAt: '2023-10-05', logs: [] },
    { id: 'PROD003', name: 'Cold-Ez Syrup', pharmacyName: 'MediQuick Store', category: 'Cold & Flu', price: 8.99, stock: 0, status: 'Pending', imageUrl: 'https://placehold.co/100x100.png', description: 'Multi-symptom cold and flu relief for adults.', usageInstructions: '2 teaspoons every 6 hours.', createdAt: '2024-03-15', logs: [] },
    { id: 'PROD004', name: 'Hydrocortisone Cream', pharmacyName: 'The Corner Drugstore', category: 'First Aid', price: 7.25, stock: 200, status: 'Shelved', imageUrl: 'https://placehold.co/100x100.png', description: 'Topical cream for itching and skin irritation.', usageInstructions: 'Apply a thin layer to affected area 2-3 times daily.', createdAt: '2023-01-20', logs: [] },
    { id: 'PROD005', name: 'Amoxicillin 250mg', pharmacyName: 'City Central Pharma', category: 'Prescription', price: 15.00, stock: 55, status: 'Rejected', imageUrl: 'https://placehold.co/100x100.png', description: 'Antibiotic for bacterial infections. Requires prescription.', usageInstructions: 'As directed by your physician.', createdAt: '2024-03-01', logs: [] },
    { id: 'PROD006', name: 'Ibuprofen 200mg', pharmacyName: 'GoodHealth Pharmacy', category: 'Pain Relief', price: 4.50, stock: 300, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Reduces fever and relieves minor aches and pain.', usageInstructions: 'Take 1 tablet every 4 to 6 hours while symptoms persist.', createdAt: '2023-12-01', logs: [] },
    { id: 'PROD007', name: 'Multivitamin Gummies', pharmacyName: 'Wellness Rx', category: 'Vitamins', price: 15.99, stock: 120, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Complete multivitamin for adults in a tasty gummy form.', usageInstructions: 'Chew two gummies daily.', createdAt: '2023-11-20', logs: [] },
    { id: 'PROD008', name: 'Allergy Relief Pills', pharmacyName: 'MediQuick Store', category: 'Cold & Flu', price: 11.29, stock: 75, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: '24-hour relief from sneezing, runny nose, and itchy eyes.', usageInstructions: 'Take one tablet daily.', createdAt: '2024-02-10', logs: [] },
    { id: 'PROD009', name: 'Band-Aid Pack', pharmacyName: 'The Corner Drugstore', category: 'First Aid', price: 3.99, stock: 500, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Assorted sizes of adhesive bandages.', usageInstructions: 'Apply to clean, dry skin.', createdAt: '2023-01-15', logs: [] },
    { id: 'PROD010', name: 'Metformin 500mg', pharmacyName: 'City Central Pharma', category: 'Prescription', price: 25.00, stock: 90, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Used to treat type 2 diabetes.', usageInstructions: 'As directed by your physician.', createdAt: '2023-09-01', logs: [] },
    { id: 'PROD011', name: 'Tylenol Extra Strength', pharmacyName: 'GoodHealth Pharmacy', category: 'Pain Relief', price: 9.49, stock: 200, status: 'Approved', imageUrl: 'https://placehold.co/100x100.png', description: 'Acetaminophen 500mg. Pain reliever and fever reducer.', usageInstructions: 'Take 2 caplets every 6 hours.', createdAt: '2024-01-05', logs: [] },
    { id: 'PROD012', name: 'Vitamin D3 2000IU', pharmacyName: 'Wellness Rx', category: 'Vitamins', price: 8.79, stock: 150, status: 'Pending', imageUrl: 'https://placehold.co/100x100.png', description: 'Supports bone and immune health.', usageInstructions: 'Take one softgel daily with a meal.', createdAt: '2024-03-18', logs: [] },
];

const PAGE_SIZE = 10;

function CategoryManager({ open, onOpenChange, categories, onCategoriesChange }: { open: boolean, onOpenChange: (open: boolean) => void, categories: Category[], onCategoriesChange: (categories: Category[]) => void }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const { toast } = useToast();

    const handleOpenForm = (category?: Category) => {
        setCurrentCategory(category || {});
        setIsFormOpen(true);
    };

    const handleSaveCategory = () => {
        if (currentCategory?.id) {
            onCategoriesChange(categories.map(c => c.id === currentCategory.id ? { ...c, ...currentCategory } as Category : c));
            toast({ title: "Category Updated", description: `Category "${currentCategory.name}" has been updated.` });
        } else {
            const newCategory: Category = {
                id: `CAT${String(categories.length + 1).padStart(3, '0')}`,
                name: currentCategory?.name || 'Untitled Category',
                description: currentCategory?.description || '',
                productCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
            };
            onCategoriesChange([newCategory, ...categories]);
            toast({ title: "Category Created", description: `Category "${newCategory.name}" has been created.` });
        }
        setIsFormOpen(false);
        setCurrentCategory(null);
    };

    const handleDeleteCategory = (categoryId: string) => {
        onCategoriesChange(categories.filter(c => c.id !== categoryId));
        toast({ variant: "destructive", title: "Category Deleted", description: "The category has been permanently deleted." });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Drug Category Management</DialogTitle>
                    <DialogDescription>Manage the categories for all drugs in the system.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex justify-end mb-4">
                        <Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2 h-4 w-4"/>New Category</Button>
                    </div>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Product Count</TableHead><TableHead className="text-center">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {categories.map(cat => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell>{cat.description}</TableCell>
                                        <TableCell>{cat.productCount}</TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleOpenForm(cat)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem></AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>This will permanently delete the category. This action cannot be undone.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)}>Delete</AlertDialogAction>
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
                </div>

                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentCategory?.id ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="cat-name">Category Name</Label>
                                <Input id="cat-name" value={currentCategory?.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cat-desc">Description</Label>
                                <Textarea id="cat-desc" value={currentCategory?.description || ''} onChange={e => setCurrentCategory({...currentCategory, description: e.target.value})} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button onClick={handleSaveCategory}>Save Category</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function DrugCategoryManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiConfirmOpen, setIsAiConfirmOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{description?: string; usage?: string} | null>(null);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [searchTerm, products, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / 5) * 5;
    const end = Math.min(start + 5, totalPages);
    return Array.from({ length: end - start }, (_, i) => start + i + 1);
  };

  const handleOpenForm = (product?: Product) => {
    setCurrentProduct(product || {});
    setIsFormOpen(true);
  };

  const handleOpenHistory = (product: Product) => {
    setCurrentProduct(product);
    setIsHistoryOpen(true);
  }
  
  const handleSaveProduct = () => {
    if (generatedContent) {
        setIsAiConfirmOpen(true);
    } else {
        saveProduct();
    }
  };
  
  const saveProduct = () => {
    const productDataToSave = generatedContent ? { ...currentProduct, description: generatedContent.description, usageInstructions: generatedContent.usage } : currentProduct;
  
    if (productDataToSave?.id) {
        setProducts(products.map(p => p.id === productDataToSave.id ? { ...p, ...productDataToSave } as Product : p));
        toast({ title: "Product Updated", description: `Details for ${productDataToSave.name} have been updated.` });
    } else {
        const newProduct: Product = {
            id: `PROD${String(products.length + 1).padStart(3, '0')}`,
            name: productDataToSave?.name || 'New Product',
            pharmacyName: 'Platform-Managed',
            category: 'Pain Relief',
            price: 0,
            stock: 0,
            status: 'Pending',
            imageUrl: 'https://placehold.co/100x100.png',
            description: productDataToSave?.description || '',
            usageInstructions: productDataToSave?.usageInstructions || '',
            createdAt: new Date().toISOString().split('T')[0],
            logs: [],
            ...productDataToSave
        };
        setProducts([newProduct, ...products]);
        toast({ title: "Product Added", description: `${newProduct.name} has been added and is pending approval.` });
    }
    
    // Reset states
    setIsFormOpen(false);
    setCurrentProduct(null);
    setGeneratedContent(null);
    setIsAiConfirmOpen(false);
  };

  const handleUpdateStatus = (productId: string, status: ProductStatus) => {
    setProducts(products.map(p => p.id === productId ? { ...p, status } : p));
    toast({ title: "Status Updated", description: `Product has been ${status.toLowerCase()}.` });
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ variant: "destructive", title: "Product Deleted", description: "The product has been permanently deleted from the catalog." });
  };

  const handleAiGenerate = async () => {
    if (!currentProduct?.name || !currentProduct?.category) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide a product name and category before generating.'});
        return;
    }
    setIsAiGenerating(true);
    try {
        const result = await generateProductDescription({
            name: currentProduct.name,
            category: currentProduct.category,
            description: currentProduct.description || '',
            usage: currentProduct.usageInstructions || '',
        });
        setGeneratedContent({description: result.description, usage: result.usage});
        setCurrentProduct(prev => ({...prev, description: result.description, usageInstructions: result.usage}));
        toast({ title: 'Content Generated', description: 'AI has generated the product description and usage.' });
    } catch (error) {
        console.error("AI generation failed:", error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate content. Please try again.' });
    } finally {
        setIsAiGenerating(false);
    }
  }

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
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      {/* Category Sidebar */}
      <aside>
          <h3 className="text-lg font-semibold mb-4 px-2">Categories</h3>
          <div className="flex flex-col gap-1">
            <Button
                variant={selectedCategory === 'All Categories' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => { setSelectedCategory('All Categories'); setCurrentPage(1); }}
            >
                All Categories
            </Button>
            {categories.map(category => (
                <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(1);
                    }}
                >
                    {category.name}
                </Button>
            ))}
          </div>
          <Separator className="my-4" />
           <Button variant="outline" className="w-full justify-start" onClick={() => setIsCategoryManagerOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Categories
           </Button>
      </aside>

      {/* Main Content */}
      <main>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or pharmacy..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
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
              {paginatedProducts.map(product => (
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
                        <DropdownMenuItem onClick={() => handleOpenForm(product)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
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
                         <DropdownMenuItem onClick={() => handleOpenHistory(product)}>
                           <History className="mr-2 h-4 w-4" /> View History
                         </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                             </DropdownMenuItem>
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
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPaginationGroup().map(pageNumber => (
                    <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                    >
                        {pageNumber}
                    </Button>
                ))}
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </main>

      {/* Product Edit/Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setGeneratedContent(null); }}>
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
               <Select value={currentProduct?.category} onValueChange={(value: string) => setCurrentProduct({...currentProduct, category: value})}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" type="number" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="col-span-3" />
            </div>
            <div className="relative grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea id="description" value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="col-span-3" />
            </div>
            <div className="relative grid grid-cols-4 items-start gap-4">
              <Label htmlFor="usage" className="text-right pt-2">Usage Instructions</Label>
              <Textarea id="usage" value={currentProduct?.usageInstructions || ''} onChange={(e) => setCurrentProduct({...currentProduct, usageInstructions: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <div/>
                <Button variant="outline" onClick={handleAiGenerate} disabled={isAiGenerating} className="col-span-3">
                    {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isAiGenerating ? 'Generating...' : 'AI-Complete Description & Usage'}
                </Button>
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
            <DialogClose asChild><Button variant="outline" onClick={() => setGeneratedContent(null)}>Cancel</Button></DialogClose>
            <Button onClick={handleSaveProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modification History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification History for {currentProduct?.name}</DialogTitle>
            <DialogDescription>Showing all recorded changes for this product.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
             {currentProduct?.logs && currentProduct.logs.length > 0 ? (
                <div className="relative pl-6">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                    {currentProduct.logs.map((log) => (
                        <div key={log.id} className="relative mb-6">
                            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-primary -translate-x-1/2" />
                            <div className="pl-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{log.action}</p>
                                    <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>by {log.user}</span>
                                </div>
                                <p className="text-sm mt-1">{log.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground">No modification history found.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryManager open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen} categories={categories} onCategoriesChange={setCategories} />

      {/* AI Confirmation Dialog */}
       <AlertDialog open={isAiConfirmOpen} onOpenChange={setIsAiConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm AI-Generated Content</AlertDialogTitle>
                <AlertDialogDescription>
                    The description and usage instructions were generated by AI. Please review them carefully before saving.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setGeneratedContent(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={saveProduct}>Confirm & Save</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}
