import { DriverManagement } from '@/components/admin/driver-management';
import { Separator } from '@/components/ui/separator';

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Driver Management</h1>
        <p className="text-muted-foreground">
          Manage drivers, view performance, and generate feedback summaries.
        </p>
      </div>
      <Separator />
      <DriverManagement />
    </div>
  );
}
