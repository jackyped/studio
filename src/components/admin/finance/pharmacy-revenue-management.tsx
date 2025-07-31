"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, FileText } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SettlementStatus = 'Paid' | 'Pending' | 'Due' | 'Failed';

type PharmacyRevenue = {
  pharmacyId: string;
  pharmacyName: string;
  totalRevenue: number;
  platformFee: number;
  netPayout: number;
  lastSettlementDate: string;
  nextSettlementDate: string;
  status: SettlementStatus;
};

const mockPharmacyRevenue: PharmacyRevenue[] = [
    { pharmacyId: 'PHM001', pharmacyName: 'GoodHealth Pharmacy', totalRevenue: 12500.50, platformFee: 1250.05, netPayout: 11250.45, lastSettlementDate: '2024-06-30', nextSettlementDate: '2024-07-31', status: 'Pending' },
    { pharmacyId: 'PHM002', pharmacyName: 'MediQuick Store', totalRevenue: 8750.00, platformFee: 875.00, netPayout: 7875.00, lastSettlementDate: '2024-07-15', nextSettlementDate: '2024-08-15', status: 'Paid' },
    { pharmacyId: 'PHM003', pharmacyName: 'The Corner Drugstore', totalRevenue: 23450.75, platformFee: 2345.08, netPayout: 21105.67, lastSettlementDate: '2024-06-15', nextSettlementDate: '2024-07-15', status: 'Due' },
    { pharmacyId: 'PHM004', pharmacyName: 'City Central Pharma', totalRevenue: 5600.25, platformFee: 560.03, netPayout: 5040.22, lastSettlementDate: '2024-05-30', nextSettlementDate: '2024-06-30', status: 'Failed' },
    { pharmacyId: 'PHM005', pharmacyName: 'Wellness Rx', totalRevenue: 18900.00, platformFee: 1890.00, netPayout: 17010.00, lastSettlementDate: '2024-07-10', nextSettlementDate: '2024-08-10', status: 'Paid' },
];

export function PharmacyRevenueManagement() {
  const [revenues, setRevenues] = useState(mockPharmacyRevenue);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRevenues = useMemo(() => {
    let filtered = revenues;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    return filtered.filter(r =>
      r.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pharmacyId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, revenues, statusFilter]);

  const getStatusBadgeVariant = (status: SettlementStatus) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Due': return 'outline';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by pharmacy name or ID..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <DateRangePicker />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Due">Due</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">Export CSV</Button>
        </div>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Net Payout</TableHead>
              <TableHead>Next Payout Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevenues.map(revenue => (
              <TableRow key={revenue.pharmacyId}>
                <TableCell className="font-medium">
                    <div>{revenue.pharmacyName}</div>
                    <div className="text-xs text-muted-foreground">{revenue.pharmacyId}</div>
                </TableCell>
                <TableCell>${revenue.totalRevenue.toFixed(2)}</TableCell>
                <TableCell>${revenue.platformFee.toFixed(2)}</TableCell>
                <TableCell className="font-semibold">${revenue.netPayout.toFixed(2)}</TableCell>
                <TableCell>{new Date(revenue.nextSettlementDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(revenue.status)}>{revenue.status}</Badge>
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
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4"/>
                        View Statement
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Order History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Initiate Payout</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
