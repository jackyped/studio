import { ProductManagement } from '@/components/admin/product-management';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Product Management</h1>
        <p className="text-muted-foreground">
          Manage the global product catalog, approve new submissions, and control availability.
        </p>
      </div>
      <Separator />
      <ProductManagement />
    </div>
  );
}
