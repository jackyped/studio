"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TemplateType = 'Email' | 'SMS' | 'Push Notification';

type Template = {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const mockTemplates: Template[] = [
  { id: 'TPL001', name: 'Order Confirmation', type: 'Email', subject: 'Your MediChain Order #{order_id} is Confirmed!', body: 'Hi {customer_name}, thank you for your order...', createdAt: '2024-01-10', updatedAt: '2024-02-15' },
  { id: 'TPL002', name: 'Shipping Notification', type: 'SMS', subject: '', body: 'Your MediChain order #{order_id} is out for delivery. Track it here: {tracking_link}', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  { id: 'TPL003', name: 'Password Reset', type: 'Email', subject: 'Reset Your MediChain Password', body: 'Please click the link to reset your password: {reset_link}', createdAt: '2024-02-01', updatedAt: '2024-02-20' },
  { id: 'TPL004', name: 'Promotional Offer', type: 'Push Notification', subject: '✨ New Deals Just For You!', body: 'Get 15% off on all vitamins this week. Tap to shop now!', createdAt: '2024-03-01', updatedAt: '2024-03-05' },
];

export function NotificationTemplatesManagement() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template> | null>(null);
  const { toast } = useToast();

  const filteredTemplates = useMemo(() => {
    return templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, templates]);

  const handleOpenForm = (template?: Template) => {
    setCurrentTemplate(template || {});
    setIsFormOpen(true);
  };
  
  const handleSaveTemplate = () => {
    if (currentTemplate?.id) {
        setTemplates(templates.map(t => t.id === currentTemplate.id ? { ...t, ...currentTemplate, updatedAt: new Date().toISOString().split('T')[0] } as Template : t));
        toast({ title: "Template Updated", description: `Template "${currentTemplate.name}" has been updated.` });
    } else {
        const newTemplate: Template = {
            id: `TPL${String(templates.length + 1).padStart(3, '0')}`,
            name: currentTemplate?.name || 'Untitled Template',
            type: currentTemplate?.type || 'Email',
            subject: currentTemplate?.subject || '',
            body: currentTemplate?.body || '',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };
        setTemplates([newTemplate, ...templates]);
        toast({ title: "Template Created", description: `Template "${newTemplate.name}" has been created.` });
    }
    setIsFormOpen(false);
    setCurrentTemplate(null);
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({ variant: "destructive", title: "Template Deleted", description: "The notification template has been permanently deleted." });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map(template => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">
                    <div>{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.subject || 'No Subject'}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{template.type}</Badge></TableCell>
                <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenForm(template)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete this template.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>Delete</AlertDialogAction>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentTemplate?.id ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              Use placeholders like {'`{customer_name}`'} or {'`{order_id}`'} which will be replaced with real data upon sending.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" placeholder="e.g. Order Confirmation Email" value={currentTemplate?.name || ''} onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Template Type</Label>
              <Select value={currentTemplate?.type} onValueChange={(value: TemplateType) => setCurrentTemplate({...currentTemplate, type: value})}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Push Notification">Push Notification</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="subject">Subject / Title</Label>
              <Input id="subject" placeholder="e.g. Your order is confirmed!" value={currentTemplate?.subject || ''} onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="body">Body Content</Label>
              <Textarea id="body" rows={10} placeholder="Hi {customer_name}, thank you for your order..." value={currentTemplate?.body || ''} onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
