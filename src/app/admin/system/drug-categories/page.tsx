import { DrugCategoryManagement } from '@/components/admin/system/drug-category-management';
import { Separator } from '@/components/ui/separator';

export default function DrugCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Drug Category Management</h1>
        <p className="text-muted-foreground">
          Manage the categories for all drugs in the system.
        </p>
      </div>
      <Separator />
      <DrugCategoryManagement />
    </div>
  );
}
