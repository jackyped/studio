import { PharmacyRevenueManagement } from '@/components/admin/finance/pharmacy-revenue-management';
import { Separator } from '@/components/ui/separator';

export default function PharmacyRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Pharmacy Revenue</h1>
        <p className="text-muted-foreground">
          Manage pharmacy earnings, settlements, and view detailed financial statements.
        </p>
      </div>
      <Separator />
      <PharmacyRevenueManagement />
    </div>
  );
}
