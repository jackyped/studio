import { Pill } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ href = '/', className }: { href?: string, className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 text-primary font-bold text-lg font-headline", className)}>
      <Pill className="h-6 w-6" />
      <span>MediChain</span>
    </Link>
  );
}
