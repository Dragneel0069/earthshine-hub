import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import {
  Award,
  Plus,
  Shield,
  Globe,
  Building2,
  FileText,
  TrendingUp,
  Leaf,
  Target,
  Construction,
} from "lucide-react";
import { SEO } from "@/components/shared/SEO";

const CERTIFICATION_INFO = {
  bcorp: {
    name: "B Corp",
    description: "Certified B Corporations meet high standards of social and environmental performance",
    icon: Award,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  cdp: {
    name: "CDP",
    description: "Global disclosure system for environmental impact reporting",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  gri: {
    name: "GRI",
    description: "Global Reporting Initiative sustainability reporting standards",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  csrd: {
    name: "CSRD",
    description: "EU Corporate Sustainability Reporting Directive compliance",
    icon: Building2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  tcfd: {
    name: "TCFD",
    description: "Task Force on Climate-related Financial Disclosures",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  sasb: {
    name: "SASB",
    description: "Sustainability Accounting Standards Board industry-specific standards",
    icon: Shield,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  sbti: {
    name: "SBTi",
    description: "Science Based Targets initiative for emissions reduction",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  ecovadis: {
    name: "EcoVadis",
    description: "Business sustainability ratings for supply chains",
    icon: Leaf,
    color: "text-lime-600",
    bgColor: "bg-lime-100",
  },
};

type CertificationType = keyof typeof CERTIFICATION_INFO;

export default function Certifications() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Climate Certifications"
        url="/certifications"
        description="Track your progress toward B Corp, CDP, GRI, CSRD, and other sustainability certifications with milestone tracking."
      />
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Climate Certifications</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress toward B Corp, CDP, GRI, CSRD, and other certifications
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>

        <Alert className="mb-8">
          <Construction className="h-4 w-4" />
          <AlertTitle>Certification Tracking Upgrade in Progress</AlertTitle>
          <AlertDescription>
            The certification tracking system is being upgraded to support organization-level 
            tracking with milestone management and team collaboration. This will be available 
            after Phase 3 of the backend migration.
          </AlertDescription>
        </Alert>

        {!user ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sign in to track certifications</h3>
              <p className="text-muted-foreground mb-4">
                Create an account to start tracking your certification progress
              </p>
              <Button asChild>
                <a href="/signup">Get Started</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Available Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(CERTIFICATION_INFO) as CertificationType[]).map((key) => {
                const info = CERTIFICATION_INFO[key];
                const Icon = info.icon;
                return (
                  <Card key={key} className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${info.bgColor}`}>
                          <Icon className={`h-5 w-5 ${info.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{info.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {info.description}
                      </CardDescription>
                      <Badge variant="outline" className="mt-3">
                        Coming Soon
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
