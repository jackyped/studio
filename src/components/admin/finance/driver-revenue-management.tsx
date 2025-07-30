"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PayoutStatus = 'Paid' | 'Pending' | 'Requested' | 'Failed';

type DriverRevenue = {
  driverId: string;
  driverName: string;
  totalEarnings: number;
  platformFee: number;
  netBalance: number;
  lastPayoutDate: string;
  status: PayoutStatus;
};

const mockDriverRevenue: DriverRevenue[] = [
    { driverId: 'DRV001', driverName: 'John Doe', totalEarnings: 2500.75, platformFee: 250.08, netBalance: 2250.67, lastPayoutDate: '2024-07-10', status: 'Paid' },
    { driverId: 'DRV002', driverName: 'Jane Smith', totalEarnings: 1800.50, platformFee: 180.05, netBalance: 1620.45, lastPayoutDate: '2024-07-12', status: 'Requested' },
    { driverId: 'DRV003', driverName: 'Mike Ross', totalEarnings: 320.00, platformFee: 32.00, netBalance: 288.00, lastPayoutDate: '2024-06-20', status: 'Pending' },
    { driverId: 'DRV005', driverName: 'Harvey Specter', totalEarnings: 4500.00, platformFee: 450.00, netBalance: 4050.00, lastPayoutDate: '2024-07-05', status: 'Paid' },
    { driverId: 'DRV007', driverName: 'Louis Litt', totalEarnings: 0, platformFee: 0, netBalance: 0, lastPayoutDate: 'N/A', status: 'Pending' },
];

export function DriverRevenueManagement() {
  const [revenues, setRevenues] = useState(mockDriverRevenue);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRevenues = useMemo(() => {
    let filtered = revenues;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    return filtered.filter(r =>
      r.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driverId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, revenues, statusFilter]);

  const getStatusBadgeVariant = (status: PayoutStatus) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Requested': return 'outline';
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
            placeholder="Search by driver name or ID..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Requested">Requested</SelectItem>
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
              <TableHead>Driver</TableHead>
              <TableHead>Total Earnings</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Available Balance</TableHead>
              <TableHead>Last Payout</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevenues.map(revenue => (
              <TableRow key={revenue.driverId}>
                <TableCell className="font-medium">
                    <div>{revenue.driverName}</div>
                    <div className="text-xs text-muted-foreground">{revenue.driverId}</div>
                </TableCell>
                <TableCell>${revenue.totalEarnings.toFixed(2)}</TableCell>
                <TableCell>${revenue.platformFee.toFixed(2)}</TableCell>
                <TableCell className="font-semibold">${revenue.netBalance.toFixed(2)}</TableCell>
                <TableCell>{revenue.lastPayoutDate !== 'N/A' ? new Date(revenue.lastPayoutDate).toLocaleDateString() : 'N/A'}</TableCell>
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
                      <DropdownMenuItem>View Payout History</DropdownMenuItem>
                       <DropdownMenuItem>View Delivery History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                       {revenue.status === 'Requested' && (
                        <DropdownMenuItem>Approve Payout</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Adjust Balance</DropdownMenuItem>
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
