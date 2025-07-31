import { PlatformRevenueManagement } from '@/components/admin/finance/platform-revenue-management';
import { Separator } from '@/components/ui/separator';

export default function PlatformRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Platform Revenue</h1>
        <p className="text-muted-foreground">
          View and manage the platform's income and expenses.
        </p>
      </div>
      <Separator />
      <PlatformRevenueManagement />
    </div>
  );
}
