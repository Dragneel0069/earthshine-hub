import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { GlobalErrorBoundary } from "@/components/shared/GlobalErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reports from "./pages/Reports";
import Marketplace from "./pages/Marketplace";
import Calculators from "./pages/Calculators";
import Consultation from "./pages/Consultation";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Certifications from "./pages/Certifications";
import Blog from "./pages/Blog";
import SustainabilityQuiz from "./pages/SustainabilityQuiz";
import ComplianceHub from "./pages/ComplianceHub";
import KnowledgeAgent from "./pages/KnowledgeAgent";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ScrollDemo from "./pages/ScrollDemo";
import Methodology from "./pages/Methodology";

const queryClient = new QueryClient();

const App = () => (
  <GlobalErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/about" element={<About />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/compliance" element={<ComplianceHub />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/quiz" element={<SustainabilityQuiz />} />
                <Route path="/knowledge" element={<KnowledgeAgent />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/scroll-demo" element={<ScrollDemo />} />
                <Route path="/methodology" element={<Methodology />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </GlobalErrorBoundary>
);

export default App;
