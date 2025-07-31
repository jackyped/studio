import { DriverRevenueManagement } from '@/components/admin/finance/driver-revenue-management';
import { Separator } from '@/components/ui/separator';

export default function DriverRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Driver Revenue</h1>
        <p className="text-muted-foreground">
          Manage driver earnings, settlements, and withdrawal requests.
        </p>
      </div>
      <Separator />
      <DriverRevenueManagement />
    </div>
  );
}
