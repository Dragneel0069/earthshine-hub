import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Menu, 
  X, 
  Calculator,
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
import { motion } from "framer-motion";
import zeroGraphLogo from "@/assets/zerograph-logo.png";

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
    title: "Climate Education",
    description: "Learn about carbon accounting and sustainability",
    icon: Info,
    href: "/blog",
  },
  {
    title: "Certifications",
    description: "Track B Corp, CDP, GRI progress",
    icon: Shield,
    href: "/certifications",
  },
  {
    title: "Compliance Hub",
    description: "CSRD, BRSR, SEC reporting",
    icon: FileText,
    href: "/compliance",
  },
  {
    title: "Readiness Quiz",
    description: "Assess your sustainability maturity",
    icon: TreePine,
    href: "/quiz",
  },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      className="sticky top-0 z-50 w-full border-b border-border/50 glass"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img 
            src={zeroGraphLogo} 
            alt="Zero Graph Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-xl font-bold text-foreground">Zero Graph</span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-primary font-medium">LIVE</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.title}</div>
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
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Our Platforms
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl">
                    {platforms.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.title}</div>
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
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Calculators
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl">
                    {calculators.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.title}</div>
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
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Information
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl">
                    {information.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.title}</div>
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
            <a href="mailto:info@zerograph.in" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden xl:inline">info@zerograph.in</span>
            </a>
            <a href="tel:+911800XXXXXXX" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">+91 1800-XXX-XXXX</span>
            </a>
          </div>
          <div className="h-6 w-px bg-border" />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="container py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-4">Solutions</p>
              {solutions.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{item.title}</span>
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
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-4">Calculators</p>
              <Link
                to="/calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <Calculator className="h-5 w-5 text-primary" />
                <span className="text-foreground">All Calculators</span>
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-border/50">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground">Sign Up</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}