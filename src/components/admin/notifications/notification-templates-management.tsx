"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function NotificationTemplatesManagement() {
  return (
    <div>
        <div className="flex justify-end">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Template
            </Button>
        </div>
        <div className="mt-4 border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Template management feature is not yet implemented.</p>
        </div>
    </div>
  )
}
