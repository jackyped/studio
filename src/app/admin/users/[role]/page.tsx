
import { UserManagement } from '@/components/admin/user-management';
import { Separator } from '@/components/ui/separator';

export default function UsersByRolePage({ params }: { params: { role: string } }) {
  const role = params.role;
  // Make title robust to handle plural forms like 'customers' -> 'Customers'
  const title = role.charAt(0).toUpperCase() + (role.endsWith('s') ? role.slice(1, -1) : role.slice(1)) + 's';


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">{title} Management</h1>
        <p className="text-muted-foreground">
          Manage all {role} on the platform.
        </p>
      </div>
      <Separator />
      <UserManagement roleFilter={role.endsWith('s') ? role.slice(0, -1) : role} />
    </div>
  );
}
