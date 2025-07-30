"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutGrid,
  Users,
  Store,
  Truck,
  Package,
  ShoppingCart,
  Ticket,
  Wallet,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/pharmacies', label: 'Pharmacies', icon: Store },
  { href: '/admin/drivers', label: 'Drivers', icon: Truck },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/promotions', label: 'Promotions', icon: Ticket },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
];

const helpAndSettingsItems = [
    { href: '/admin/support', label: 'Support', icon: HelpCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false;
    return pathname.startsWith(path);
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{children: item.label}}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {helpAndSettingsItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{children: item.label}}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="text-left group-data-[collapsible=icon]:hidden">
                        <p className="font-medium text-sm">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@medichain.com</p>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
