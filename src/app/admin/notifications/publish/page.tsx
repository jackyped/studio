import { NotificationPublishing } from '@/components/admin/notifications/notification-publishing';
import { Separator } from '@/components/ui/separator';

export default function NotificationPublishingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Notification Publishing</h1>
        <p className="text-muted-foreground">
          Select and send notifications to your audience.
        </p>
      </div>
      <Separator />
      <NotificationPublishing />
    </div>
  );
}
