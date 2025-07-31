
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';

type TransactionType = 'Commission' | 'Subscription Fee' | 'Service Fee' | 'Marketing Spend' | 'Refund';
type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
};

const mockTransactions: Transaction[] = [
    { id: 'TRN001', date: '2024-07-15', description: 'Commission from ORD001', type: 'Commission', status: 'Completed', amount: 4.55 },
    { id: 'TRN002', date: '2024-07-15', description: 'Commission from ORD002', type: 'Commission', status: 'Completed', amount: 1.90 },
    { id: 'TRN003', date: '2024-07-14', description: 'Facebook Ads Campaign', type: 'Marketing Spend', status: 'Completed', amount: -500.00 },
    { id: 'TRN004', date: '2024-07-13', description: 'GoodHealth Pharmacy Subscription', type: 'Subscription Fee', status: 'Completed', amount: 49.99 },
    { id: 'TRN005', date: '2024-07-12', description: 'Refund for ORD005', type: 'Refund', status: 'Completed', amount: -3.50 },
    { id: 'TRN006', date: '2024-07-11', description: 'Server Hosting Bill', type: 'Service Fee', status: 'Pending', amount: -150.00 },
];

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleDateString());
    }, [dateString]);

    return <>{formattedDate}</>;
}


export function PlatformRevenueManagement() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, transactions]);

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getAmountClass = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by description or ID..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Record
            </Button>
        </div>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell><FormattedDate dateString={transaction.date} /></TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${getAmountClass(transaction.amount)}`}>
                    {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
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
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
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
