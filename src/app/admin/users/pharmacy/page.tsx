
import { PharmacyUserManagement } from '@/components/admin/user/pharmacy-user-management';
import { Separator } from '@/components/ui/separator';

export default function PharmaciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Pharmacies Management</h1>
        <p className="text-muted-foreground">
          Manage all pharmacies on the platform.
        </p>
      </div>
      <Separator />
      <PharmacyUserManagement />
    </div>
  );
}
