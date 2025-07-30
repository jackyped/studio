'use client'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Users, Truck, DollarSign } from "lucide-react"

const salesData = [
    { date: "2024-07-01", sales: 23 },
    { date: "2024-07-02", sales: 35 },
    { date: "2024-07-03", sales: 55 },
    { date: "2024-07-04", sales: 42 },
    { date: "2024-07-05", sales: 60 },
    { date: "2024-07-06", sales: 54 },
    { date: "2024-07-07", sales: 72 },
  ];
  
  const usersData = [
    { month: "Jan", users: 150 },
    { month: "Feb", users: 230 },
    { month: "Mar", users: 340 },
    { month: "Apr", users: 410 },
    { month: "May", users: 505 },
    { month: "Jun", users: 580 },
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
            <CardTitle>Sales This Week</CardTitle>
            <CardDescription>A summary of sales in the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={salesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
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
            <CardTitle>New User Growth</CardTitle>
            <CardDescription>New user sign-ups over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={usersData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
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
