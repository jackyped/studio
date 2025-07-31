import { NotificationTracking } from '@/components/admin/notifications/notification-tracking';
import { Separator } from '@/components/ui/separator';

export default function NotificationTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Notification Tracking</h1>
        <p className="text-muted-foreground">
          Monitor the status and results of sent notifications.
        </p>
      </div>
      <Separator />
      <NotificationTracking />
    </div>
  );
}
