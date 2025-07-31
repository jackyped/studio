
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // In a real app, you would handle form submission to your API
        toast({
            title: "User Created",
            description: "The new user has been successfully created.",
        });
        router.push('/admin/users');
    };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Add New User</h1>
       </div>
      
       <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>New User Details</CardTitle>
                <CardDescription>Fill out the form below to create a new user account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="e.g. John Doe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="e.g. john.doe@example.com" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="Customer">
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Customer">Customer</SelectItem>
                            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="Driver">Driver</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a strong password" required />
                </div>
                 <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </CardContent>
        </Card>
       </form>
    </div>
  );
}
