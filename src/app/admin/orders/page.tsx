import { OrderManagement } from '@/components/admin/order-management';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Order Management</h1>
        <p className="text-muted-foreground">
          Monitor, track, and manage all customer orders from creation to completion.
        </p>
      </div>
      <Separator />
      <OrderManagement />
    </div>
  );
}
