"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function SendingChannelsManagement() {
  return (
    <div>
        <div className="flex justify-end">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Channel
            </Button>
        </div>
        <div className="mt-4 border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Sending channel management feature is not yet implemented.</p>
        </div>
    </div>
  )
}
