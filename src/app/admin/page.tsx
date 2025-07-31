
'use client'
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Users, Truck, DollarSign, Search } from "lucide-react"
import { DateRangePicker } from '@/components/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';

const generate2025SalesData = () => {
    const data = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    let currentDate = startDate;

    while (currentDate <= endDate) {
        data.push({
            date: currentDate.toISOString().split('T')[0],
            sales: Math.floor(Math.random() * (150 - 50 + 1)) + 50,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
}

const allSalesData = generate2025SalesData();
  
const allUsersData = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    date: `2025-${String(month).padStart(2, '0')}-15`,
    users: 200 + i * 50 + Math.floor(Math.random() * 80),
  };
});

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
    from: new Date('2025-01-01'),
    to: new Date('2025-01-31'),
  });
  
  const [usersDate, setUsersDate] = useState<DateRange | undefined>({
    from: new Date('2025-01-01'),
    to: new Date('2025-12-31'),
  });

  const [filteredSales, setFilteredSales] = useState(() => {
    const from = new Date('2025-01-01');
    const to = new Date('2025-01-31');
    return allSalesData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= from && itemDate <= to;
    });
  });
  
  const [filteredUsers, setFilteredUsers] = useState(() => {
      const from = new Date('2025-01-01');
      const to = new Date('2025-12-31');
      return allUsersData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= from && itemDate <= to;
    });
  });
  
  const handleFilterSales = () => {
    if (salesDate?.from && salesDate?.to) {
      const from = new Date(salesDate.from.setHours(0,0,0,0));
      const to = new Date(salesDate.to.setHours(23,59,59,999));
      const filtered = allSalesData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= from && itemDate <= to;
      });
      setFilteredSales(filtered);
    }
  };

  const handleFilterUsers = () => {
    if (usersDate?.from && usersDate?.to) {
        const from = new Date(usersDate.from.setHours(0,0,0,0));
        const to = new Date(usersDate.to.setHours(23,59,59,999));
        const filtered = allUsersData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= from && itemDate <= to;
        });
        setFilteredUsers(filtered);
    }
  };


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
                <div className="flex items-center gap-2">
                  <DateRangePicker date={salesDate} onDateChange={setSalesDate} />
                  <Button onClick={handleFilterSales} size="icon">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Query Sales</span>
                  </Button>
                </div>
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
                 <div className="flex items-center gap-2">
                    <DateRangePicker date={usersDate} onDateChange={setUsersDate} />
                    <Button onClick={handleFilterUsers} size="icon">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Query Users</span>
                    </Button>
                 </div>
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
