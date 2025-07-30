import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Store, Truck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Home() {
  const portals = [
    {
      title: "Customer Portal",
      description: "Order medicines, track deliveries, and manage your health profile.",
      icon: <User className="h-8 w-8 text-primary" />,
      link: "/login",
      cta: "Order Now",
    },
    {
      title: "Pharmacy Portal",
      description: "Manage inventory, handle orders, and connect with customers.",
      icon: <Store className="h-8 w-8 text-primary" />,
      link: "/login",
      cta: "Manage Store",
    },
    {
      title: "Driver Portal",
      description: "Accept delivery tasks, navigate routes, and track your earnings.",
      icon: <Truck className="h-8 w-8 text-primary" />,
      link: "/login",
      cta: "Start Driving",
    },
    {
      title: "Admin Dashboard",
      description: "Oversee operations, manage users, and view platform analytics.",
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      link: "/admin",
      cta: "Go to Dashboard",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 md:px-6 h-16 flex items-center">
        <Logo />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Reliable Medicine Delivery, Right to Your Doorstep
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MediChain connects you with local pharmacies for fast and secure delivery of your health needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
              <img
                data-ai-hint="pharmacy delivery"
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        
        <section id="portals" className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">One Platform, Four Portals</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tailored experiences for every user, ensuring seamless operation and satisfaction.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4">
              {portals.map((portal) => (
                <Card key={portal.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center text-center">
                    {portal.icon}
                    <CardTitle className="mt-4">{portal.title}</CardTitle>
                    <CardDescription>{portal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild>
                      <Link href={portal.link}>{portal.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MediChain. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
