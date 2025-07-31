
'use client'
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Users, Truck, DollarSign } from "lucide-react"
import { DateRangePicker } from '@/components/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

const allSalesData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * (80 - 20 + 1)) + 20,
    };
  }).reverse();
  
  const allUsersData = [
    { date: "2024-01-15", users: 150 },
    { date: "2024-02-10", users: 230 },
    { date: "2024-03-05", users: 340 },
    { date: "2024-04-20", users: 410 },
    { date: "2024-05-18", users: 505 },
    { date: "2024-06-25", users: 580 },
    { date: "2024-07-10", users: 620 },
  ];

const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
    users: {
        label: "New Users",
        color: "hsl(var(--accent))",
    }
}

export default function AdminDashboard() {
  const [salesDate, setSalesDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  
  const [usersDate, setUsersDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const [filteredSales, setFilteredSales] = useState(allSalesData);
  const [filteredUsers, setFilteredUsers] = useState(allUsersData);
  
  useEffect(() => {
    if (salesDate?.from && salesDate?.to) {
      const filtered = allSalesData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= salesDate.from! && itemDate <= salesDate.to!;
      });
      setFilteredSales(filtered);
    } else {
        setFilteredSales(allSalesData.slice(-7));
    }
  }, [salesDate]);

  useEffect(() => {
    if (usersDate?.from && usersDate?.to) {
        const filtered = allUsersData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= usersDate.from! && itemDate <= usersDate.to!;
        });
        setFilteredUsers(filtered);
    } else {
        setFilteredUsers(allUsersData);
    }
  }, [usersDate]);


  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a quick overview of your platform's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">+19% from last hour</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
      <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>A summary of sales in the selected period.</CardDescription>
                </div>
                <DateRangePicker date={salesDate} onDateChange={setSalesDate} />
             </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={filteredSales} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>New User Growth</CardTitle>
                    <CardDescription>New user sign-ups over the selected period.</CardDescription>
                </div>
                 <DateRangePicker date={usersDate} onDateChange={setUsersDate} />
             </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={filteredUsers} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} dot={true} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

    