import { FinancialOverview } from '@/components/admin/finance/financial-overview';
import { Separator } from '@/components/ui/separator';

export default function FinancialOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Financial Overview</h1>
        <p className="text-muted-foreground">
          A high-level summary of the platform's financial performance.
        </p>
      </div>
      <Separator />
      <FinancialOverview />
    </div>
  );
}
