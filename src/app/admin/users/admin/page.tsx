
import { AdminUserManagement } from '@/components/admin/user/admin-user-management';
import { Separator } from '@/components/ui/separator';

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Admins Management</h1>
        <p className="text-muted-foreground">
          Manage all administrators on the platform.
        </p>
      </div>
      <Separator />
      <AdminUserManagement />
    </div>
  );
}
