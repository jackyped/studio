
import { CustomerUserManagement } from '@/components/admin/user/customer-user-management';
import { Separator } from '@/components/ui/separator';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Customers Management</h1>
        <p className="text-muted-foreground">
          Manage all customers on the platform.
        </p>
      </div>
      <Separator />
      <CustomerUserManagement />
    </div>
  );
}
