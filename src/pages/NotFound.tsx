import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to Zero Graph's homepage to explore our carbon tracking solutions."
        noIndex={true}
      />
      
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-display font-bold text-primary/20 mb-2">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        
        {/* Attempted path */}
        <div className="mb-8 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Attempted URL: <code className="text-primary font-mono">{location.pathname}</code>
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Or explore these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/calculators" className="text-sm text-primary hover:underline">
              Carbon Calculator
            </Link>
            <span className="text-border">•</span>
            <Link to="/marketplace" className="text-sm text-primary hover:underline">
              Carbon Credits
            </Link>
            <span className="text-border">•</span>
            <Link to="/about" className="text-sm text-primary hover:underline">
              About Us
            </Link>
            <span className="text-border">•</span>
            <Link to="/consultation" className="text-sm text-primary hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
