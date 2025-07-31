
import { DriverUserManagement } from '@/components/admin/user/driver-user-management';
import { Separator } from '@/components/ui/separator';

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Drivers Management</h1>
        <p className="text-muted-foreground">
          Manage all drivers on the platform.
        </p>
      </div>
      <Separator />
      <DriverUserManagement />
    </div>
  );
}
