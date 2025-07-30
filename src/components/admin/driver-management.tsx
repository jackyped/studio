"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { driverFeedbackSummary } from '@/ai/flows/review-summary';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Driver = {
  id: string;
  name: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending';
  rating: number;
  feedback: string;
};

const mockDrivers: Driver[] = [
    { id: 'DRV001', name: 'John Doe', phone: '+1-202-555-0104', status: 'Active', rating: 4.8, feedback: "John is always on time and very professional. The packages are always handled with care. Sometimes he seems to be in a rush, but overall a great driver." },
    { id: 'DRV002', name: 'Jane Smith', phone: '+1-202-555-0162', status: 'Active', rating: 4.5, feedback: "Jane is friendly but has been late a few times. The delivery ETA is not always accurate. She communicates well when she's running behind." },
    { id: 'DRV003', name: 'Mike Ross', phone: '+1-202-555-0125', status: 'Inactive', rating: 3.2, feedback: "Mike often gets lost and has trouble finding the address. I've had to go out and meet him. He also delivered to the wrong house once." },
    { id: 'DRV004', name: 'Rachel Zane', phone: '+1-202-555-0187', status: 'Pending', rating: 0, feedback: "" },
    { id: 'DRV005', name: 'Harvey Specter', phone: '+1-202-555-0199', status: 'Active', rating: 5.0, feedback: "Flawless delivery every time. Harvey is the best." },
];

export function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleOpenSummaryDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    setSummary('');
    setIsSummaryDialogOpen(true);
  };

  const handleGenerateSummary = async () => {
    if (!selectedDriver || !selectedDriver.feedback) return;
    setIsLoadingSummary(true);
    try {
      const result = await driverFeedbackSummary({ feedback: selectedDriver.feedback });
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

  const getStatusBadgeVariant = (status: Driver['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'destructive';
      case 'Pending':
        return 'secondary';
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
        <Button>Add Driver</Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!driver.feedback}
                        onClick={() => handleOpenSummaryDialog(driver)}
                      >
                        Summarize Feedback
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
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
            <DialogTitle>Feedback Summary for {selectedDriver?.name}</DialogTitle>
            <DialogDescription>
              Generate an AI-powered summary of user feedback to identify areas for improvement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              readOnly
              value={selectedDriver?.feedback}
              className="h-32"
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
            <Button onClick={handleGenerateSummary} disabled={isLoadingSummary}>
              {isLoadingSummary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
