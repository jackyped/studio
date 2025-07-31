import { CouponDistribution } from '@/components/admin/promotions/coupon-distribution';
import { Separator } from '@/components/ui/separator';

export default function CouponDistributionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Coupon Distribution</h1>
        <p className="text-muted-foreground">
          Send coupons to specific users or groups.
        </p>
      </div>
      <Separator />
      <CouponDistribution />
    </div>
  );
}
