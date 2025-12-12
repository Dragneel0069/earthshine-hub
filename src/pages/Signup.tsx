import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Leaf, CheckCircle2 } from "lucide-react";

const benefits = [
  "Track emissions across all operations",
  "Generate compliance-ready reports",
  "Access carbon offset marketplace",
  "14-day free trial, no credit card",
];

const Signup = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center max-w-5xl mx-auto">
          {/* Left side - Benefits */}
          <div className="hidden lg:block">
            <h1 className="text-3xl font-bold font-display mb-4">
              Start your sustainability journey
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of organizations reducing their environmental impact with CarbonTrack.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-display">Create an account</CardTitle>
              <CardDescription>
                Get started with CarbonTrack in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company name</Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11">
                  Create account
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Signup;
