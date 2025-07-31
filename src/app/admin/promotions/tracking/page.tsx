import { CouponTracking } from '@/components/admin/promotions/coupon-tracking';
import { Separator } from '@/components/ui/separator';

export default function CouponTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Coupon Tracking</h1>
        <p className="text-muted-foreground">
          Monitor the status and usage of distributed coupons.
        </p>
      </div>
      <Separator />
      <CouponTracking />
    </div>
  );
}
