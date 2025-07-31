import { NotificationTemplatesManagement } from '@/components/admin/notifications/notification-templates-management';
import { Separator } from '@/components/ui/separator';

export default function NotificationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Notification Templates</h1>
        <p className="text-muted-foreground">
          Create and manage reusable notification templates.
        </p>
      </div>
      <Separator />
      <NotificationTemplatesManagement />
    </div>
  );
}
