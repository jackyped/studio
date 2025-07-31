import { SettingsManagement } from '@/components/admin/settings-management';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">System Settings</h1>
        <p className="text-muted-foreground">
          Manage global platform settings, commission rates, and legal documents.
        </p>
      </div>
      <Separator />
      <SettingsManagement />
    </div>
  );
}
