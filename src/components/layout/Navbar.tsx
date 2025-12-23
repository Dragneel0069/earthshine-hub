import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Menu, 
  X, 
  Calculator,
  ChevronDown,
  Building2,
  Users,
  Factory,
  Briefcase,
  TreePine,
  Shield,
  Phone,
  Mail,
  Info
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutions = [
  {
    title: "For Corporates",
    description: "Enterprise carbon tracking and BRSR compliance",
    icon: Building2,
    href: "/dashboard",
  },
  {
    title: "For SMEs",
    description: "Affordable carbon management for small businesses",
    icon: Briefcase,
    href: "/dashboard",
  },
  {
    title: "For MSMEs",
    description: "Simple and cost-effective solutions for micro enterprises",
    icon: Factory,
    href: "/dashboard",
  },
];

const platforms = [
  {
    title: "Carbon Tracking",
    description: "Monitor and manage your emissions",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "BRSR Reports",
    description: "Automated compliance reporting",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Marketplace",
    description: "Buy verified carbon credits",
    icon: ShoppingBag,
    href: "/marketplace",
  },
];

const calculators = [
  {
    title: "Individual Calculator",
    description: "Calculate your personal carbon footprint",
    icon: Users,
    href: "/calculators",
  },
  {
    title: "Business Calculator",
    description: "SME and MSME carbon calculations",
    icon: Briefcase,
    href: "/calculators",
  },
  {
    title: "Corporate Calculator",
    description: "Enterprise-grade emissions tracking",
    icon: Building2,
    href: "/calculators",
  },
];

const information = [
  {
    title: "Carbon Offsetting",
    description: "Learn about carbon credits and offsetting",
    icon: TreePine,
    href: "/marketplace",
  },
  {
    title: "BRSR Compliance",
    description: "SEBI requirements explained",
    icon: Shield,
    href: "/reports",
  },
  {
    title: "About Us",
    description: "Our mission and team",
    icon: Info,
    href: "/about",
  },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Bharat Carbon</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="rounded-lg bg-primary/10 p-2">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Our Platforms</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {platforms.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="rounded-lg bg-primary/10 p-2">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Calculators</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {calculators.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="rounded-lg bg-primary/10 p-2">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Information</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {information.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="rounded-lg bg-primary/10 p-2">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Contact info and CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:info@bharatcarbon.in" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden xl:inline">info@bharatcarbon.in</span>
            </a>
            <a href="tel:+911800XXXXXXX" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">+91 1800-XXX-XXXX</span>
            </a>
          </div>
          <div className="h-6 w-px bg-border" />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background lg:hidden animate-fade-in">
          <div className="container py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-4">Solutions</p>
              {solutions.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-4">Platforms</p>
              {platforms.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-4">Calculators</p>
              <Link
                to="/calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Calculator className="h-5 w-5 text-primary" />
                All Calculators
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
