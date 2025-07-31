import { SendingChannelsManagement } from '@/components/admin/notifications/sending-channels-management';
import { Separator } from '@/components/ui/separator';

export default function SendingChannelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Sending Channels</h1>
        <p className="text-muted-foreground">
          Configure and manage notification sending channels.
        </p>
      </div>
      <Separator />
      <SendingChannelsManagement />
    </div>
  );
}
