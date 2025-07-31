"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
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
  Settings,
  LogOut,
  ChevronRight,
  CircleDollarSign,
  Building,
  UserCog,
  FileText,
  Send,
  RadioTower,
  Eye,
  Cog,
  Tag,
  Gift,
  Search,
  PenSquare,
  BarChart2,
  Files
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/pharmacies', label: 'Pharmacies', icon: Store },
  { href: '/admin/drivers', label: 'Drivers', icon: Truck },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

const promotionMenuItems = [
    { href: '/admin/promotions', label: 'Coupons', icon: Ticket },
    { href: '/admin/promotions/distribute', label: 'Distribution', icon: Gift },
    { href: '/admin/promotions/tracking', label: 'Tracking', icon: BarChart2 },
];

const financeMenuItems = [
    { href: '/admin/finance/overview', label: 'Overview', icon: Wallet },
    { href: '/admin/finance/platform-revenue', label: 'Platform', icon: CircleDollarSign },
    { href: '/admin/finance/pharmacy-revenue', label: 'Pharmacies', icon: Building },
    { href: '/admin/finance/driver-revenue', label: 'Drivers', icon: UserCog },
];

const notificationMenuItems = [
    { href: '/admin/notifications/templates', label: 'Templates', icon: FileText },
    { href: '/admin/notifications/channels', label: 'Channels', icon: RadioTower },
    { href: '/admin/notifications/create', label: 'Authoring', icon: PenSquare },
    { href: '/admin/notifications/publish', label: 'Publishing', icon: Send },
    { href: '/admin/notifications/tracking', label: 'Tracking', icon: Eye },
];

const systemMenuItems = [
    { href: '/admin/system/files', label: 'File Management', icon: Files },
];

const settingsMenuItems = [
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string, exact = false) => {
    if (exact) return pathname === path;
    // For parent items, we want to match if the path starts with the href, but not if there's a more specific match.
    // e.g. /admin/users should not activate /admin menu item
    if (path === '/admin') return pathname === '/admin';
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
              <SidebarMenuButton asChild isActive={isActive(item.href, item.href === '/admin')} tooltip={{children: item.label}}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <Collapsible asChild>
            <SidebarMenuItem className="flex-col">
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive('/admin/promotions')} className="w-full">
                      <Ticket />
                      <span>Promotions</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                  <SidebarMenu className="pl-6 pt-1">
                      {promotionMenuItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href, true)} size="sm" tooltip={{children: item.label}}>
                                  <Link href={item.href}>
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
           </Collapsible>
          <Collapsible asChild>
            <SidebarMenuItem className="flex-col">
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive('/admin/finance')} className="w-full">
                      <Wallet />
                      <span>Finance</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                  <SidebarMenu className="pl-6 pt-1">
                      {financeMenuItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href, true)} size="sm" tooltip={{children: item.label}}>
                                  <Link href={item.href}>
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
           </Collapsible>
           <Collapsible asChild>
            <SidebarMenuItem className="flex-col">
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive('/admin/notifications')} className="w-full">
                      <Bell />
                      <span>Notifications</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                  <SidebarMenu className="pl-6 pt-1">
                      {notificationMenuItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href, true)} size="sm" tooltip={{children: item.label}}>
                                  <Link href={item.href}>
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
           </Collapsible>
           <Collapsible asChild>
            <SidebarMenuItem className="flex-col">
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive('/admin/system')} className="w-full">
                      <Cog />
                      <span>System</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                  <SidebarMenu className="pl-6 pt-1">
                      {systemMenuItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href, true)} size="sm" tooltip={{children: item.label}}>
                                  <Link href={item.href}>
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
           </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {settingsMenuItems.map((item) => (
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
                    <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden"/>
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