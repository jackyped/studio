import { PromotionManagement } from '@/components/admin/promotion-management';
import { Separator } from '@/components/ui/separator';

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Coupons</h1>
        <p className="text-muted-foreground">
          Create and manage coupons, discounts, and marketing campaigns.
        </p>
      </div>
      <Separator />
      <PromotionManagement />
    </div>
  );
}
