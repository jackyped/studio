"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  { id: 'CAT003', name: 'Vitamins & Supplements', description: 'Dietary supplements to support overall health and wellness.', productCount: 45, createdAt: '2023-01-12' },
  { id: 'CAT004', name: 'Prescription Drugs', description: 'Medications that require a doctor\'s prescription.', productCount: 120, createdAt: '2023-02-01' },
  { id: 'CAT005', name: 'First Aid', description: 'Supplies for treating minor injuries like cuts, scrapes, and burns.', productCount: 30, createdAt: '2023-02-05' },
];

export function DrugCategoryManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const { toast } = useToast();

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categories]);

  const handleOpenForm = (category?: Category) => {
    setCurrentCategory(category || {});
    setIsFormOpen(true);
  };
  
  const handleSaveCategory = () => {
    if (currentCategory?.id) {
        setCategories(categories.map(c => c.id === currentCategory.id ? { ...c, ...currentCategory } as Category : c));
        toast({ title: "Category Updated", description: `Category "${currentCategory.name}" has been updated.` });
    } else {
        const newCategory: Category = {
            id: `CAT${String(categories.length + 1).padStart(3, '0')}`,
            name: currentCategory?.name || 'Untitled Category',
            description: currentCategory?.description || '',
            productCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setCategories([newCategory, ...categories]);
        toast({ title: "Category Created", description: `Category "${newCategory.name}" has been created.` });
    }
    setIsFormOpen(false);
    setCurrentCategory(null);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    toast({ variant: "destructive", title: "Category Deleted", description: "The category has been permanently deleted." });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Category
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Product Count</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                    {category.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{category.description}</TableCell>
                <TableCell>{category.productCount}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenForm(category)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete this category.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Delete</AlertDialogAction>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{currentCategory?.id ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              Manage a category for grouping drugs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="e.g. Pain Relief" value={currentCategory?.name || ''} onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} placeholder="Enter a brief description for this category..." value={currentCategory?.description || ''} onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
