import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/shared/SEO";
import { CBAMCalculator } from "@/components/compliance/CBAMCalculator";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CBAMCompliance() {
  return (
    <>
      <SEO
        title="CBAM Compliance | EU Carbon Border Adjustment"
        description="Calculate and report embedded carbon emissions for EU exports. CBAM calculator, timeline, and India exposure analysis for steel, aluminium, cement, and fertilizer exporters."
        url="/cbam"
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px]"
          />

          <div className="container relative z-10">
            <div className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 mb-4"
              >
                <Globe className="h-4 w-4" />
                <span>EU Regulation</span>
                <Badge variant="outline" className="text-xs">
                  2023/956
                </Badge>
              </div>

              <motion.h1
                className="text-3xl lg:text-4xl font-bold mb-4"
              >
                Carbon Border Adjustment Mechanism
                <span className="block text-muted-foreground text-xl lg:text-2xl font-normal mt-2">
                  CBAM Compliance for Indian Exporters
                </span>
              </motion.h1>

              <motion.p
                className="text-muted-foreground mb-6"
              >
                The EU CBAM applies to imports of iron & steel, aluminium, cement, fertilizers,
                electricity, and hydrogen. Calculate your exposure and prepare for compliance.
              </motion.p>

              <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Transitional Period Active:</strong> Quarterly reporting is mandatory from
                  October 2023. Financial obligations begin January 2026.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        {/* Main Calculator */}
        <main className="container py-8">
          <CBAMCalculator />
        </main>

        <Footer />
      </div>
  );
}
