
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FileText, Download, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FileCategory = 'All Categories' | 'Driver Documents' | 'Pharmacy Licenses' | 'System Assets';
const allCategories: FileCategory[] = ['All Categories', 'Driver Documents', 'Pharmacy Licenses', 'System Assets'];

type FileRecord = {
  id: string;
  name: string;
  category: FileCategory;
  uploadedBy: string;
  fileSize: string;
  createdAt: string;
};

const mockFiles: FileRecord[] = [
    { id: 'FILE001', name: 'john_doe_license.pdf', category: 'Driver Documents', uploadedBy: 'Admin User', fileSize: '2.3 MB', createdAt: '2024-03-01' },
    { id: 'FILE002', name: 'goodhealth_pharmacy_permit.pdf', category: 'Pharmacy Licenses', uploadedBy: 'Admin User', fileSize: '1.1 MB', createdAt: '2024-02-20' },
    { id: 'FILE003', name: 'platform_logo_light.svg', category: 'System Assets', uploadedBy: 'Admin User', fileSize: '15 KB', createdAt: '2024-01-15' },
    { id: 'FILE004', name: 'jane_smith_background_check.pdf', category: 'Driver Documents', uploadedBy: 'Admin User', fileSize: '5.5 MB', createdAt: '2024-03-05' },
    { id: 'FILE005', name: 'terms_of_service_v3.docx', category: 'System Assets', uploadedBy: 'Admin User', fileSize: '128 KB', createdAt: '2024-03-10' },
];

const PAGE_SIZE = 10;

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}


export function FileManagement() {
  const [files, setFiles] = useState(mockFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<Partial<FileRecord> | null>(null);
  const { toast } = useToast();

  const filteredFiles = useMemo(() => {
    let filtered = files;
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [searchTerm, files, selectedCategory]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredFiles.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredFiles, currentPage]);

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / 5) * 5;
    const end = Math.min(start + 5, totalPages);
    return Array.from({ length: end - start }, (_, i) => start + i + 1);
  };

  const handleOpenForm = (file?: FileRecord) => {
    setCurrentFile(file || {});
    setIsFormOpen(true);
  };
  
  const handleSaveFile = () => {
    if (currentFile?.id) {
        setFiles(files.map(f => f.id === currentFile.id ? { ...f, ...currentFile } as FileRecord : f));
        toast({ title: "File Updated", description: `Details for ${currentFile.name} have been updated.` });
    } else {
        const newFile: FileRecord = {
            id: `FILE${String(files.length + 1).padStart(3, '0')}`,
            name: currentFile?.name || 'new_file.pdf',
            category: currentFile?.category || 'System Assets',
            uploadedBy: 'Admin User',
            fileSize: '0 KB',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setFiles([newFile, ...files]);
        toast({ title: "File Record Added", description: `Record for ${newFile.name} has been created.` });
    }
    setIsFormOpen(false);
    setCurrentFile(null);
  };
  
  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
    toast({ variant: "destructive", title: "File Record Deleted", description: "The file record has been permanently deleted." });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <aside>
          <h3 className="text-lg font-semibold mb-4 px-2">File Categories</h3>
          <div className="flex flex-col gap-1">
            {allCategories.map(category => (
                <Button
                    key={category}
                    variant={selectedCategory === category ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                    }}
                >
                    {category}
                </Button>
            ))}
          </div>
      </aside>
      <main>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by file name..."
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
                Add File Record
            </Button>
          </div>
        </div>
        <div className="rounded-lg border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{file.category}</Badge></TableCell>
                  <TableCell><FormattedDate dateString={file.createdAt} /></TableCell>
                  <TableCell>{file.fileSize}</TableCell>
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
                        <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenForm(file)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                             </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>This action is permanent and cannot be undone. This will delete the file record.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteFile(file.id)}>Delete</AlertDialogAction>
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
        
        <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentFile?.id ? 'Edit File Record' : 'Add New File Record'}</DialogTitle>
            <DialogDescription>
              {currentFile?.id ? 'Update the details for this file record.' : 'Create a new file record. File upload is not supported yet.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">File Name</Label>
              <Input id="name" value={currentFile?.name || ''} onChange={(e) => setCurrentFile({...currentFile, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
               <Select value={currentFile?.category} onValueChange={(value: FileCategory) => setCurrentFile({...currentFile, category: value})}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Driver Documents">Driver Documents</SelectItem>
                      <SelectItem value="Pharmacy Licenses">Pharmacy Licenses</SelectItem>
                      <SelectItem value="System Assets">System Assets</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
                <Label>Upload File</Label>
                <Input type="file" disabled />
                <p className='text-sm text-muted-foreground'>Actual file uploads are not supported in this demo.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveFile}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

    
