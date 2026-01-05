import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "zerograph-cookie-consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container max-w-4xl mx-auto">
            <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 md:p-6 shadow-2xl">
              <button
                onClick={handleDecline}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 pr-6 md:pr-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept All", you consent to our use of cookies.{" "}
                    <Link 
                      to="/about" 
                      className="text-primary hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecline}
                    className="flex-1 md:flex-none border-border/50"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="flex-1 md:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
