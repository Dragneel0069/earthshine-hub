import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Plus,
  ChevronRight,
  Shield,
  Globe,
  Building2,
  FileText,
  TrendingUp,
  Leaf,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CERTIFICATION_INFO = {
  bcorp: {
    name: "B Corp",
    description: "Certified B Corporations meet high standards of social and environmental performance",
    icon: Award,
    color: "text-green-600",
    bgColor: "bg-green-100",
    milestones: [
      "Complete B Impact Assessment",
      "Achieve minimum score of 80",
      "Submit verification documents",
      "Complete disclosure questionnaire",
      "Sign declaration of interdependence",
      "Pay certification fees",
    ],
  },
  cdp: {
    name: "CDP",
    description: "Global disclosure system for environmental impact reporting",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    milestones: [
      "Register on CDP platform",
      "Complete climate change questionnaire",
      "Report Scope 1 & 2 emissions",
      "Report Scope 3 emissions",
      "Disclose climate risks",
      "Set science-based targets",
    ],
  },
  gri: {
    name: "GRI",
    description: "Global Reporting Initiative sustainability reporting standards",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    milestones: [
      "Identify material topics",
      "Collect stakeholder input",
      "Gather GRI-compliant data",
      "Prepare management approach disclosures",
      "Draft sustainability report",
      "Obtain external assurance",
    ],
  },
  csrd: {
    name: "CSRD",
    description: "EU Corporate Sustainability Reporting Directive compliance",
    icon: Building2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    milestones: [
      "Conduct double materiality assessment",
      "Map ESRS requirements",
      "Implement data collection systems",
      "Prepare sustainability statement",
      "Obtain limited assurance",
      "File with digital tagging",
    ],
  },
  tcfd: {
    name: "TCFD",
    description: "Task Force on Climate-related Financial Disclosures",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    milestones: [
      "Assess governance structures",
      "Identify climate risks and opportunities",
      "Conduct scenario analysis",
      "Define metrics and targets",
      "Prepare TCFD-aligned report",
      "Integrate into annual report",
    ],
  },
  sasb: {
    name: "SASB",
    description: "Sustainability Accounting Standards Board industry-specific standards",
    icon: Shield,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    milestones: [
      "Identify industry classification",
      "Map material topics",
      "Collect industry-specific metrics",
      "Prepare SASB disclosure",
      "Review with stakeholders",
      "Publish in annual filings",
    ],
  },
  sbti: {
    name: "SBTi",
    description: "Science Based Targets initiative for emissions reduction",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    milestones: [
      "Commit to SBTi",
      "Calculate base year emissions",
      "Develop science-based targets",
      "Submit targets for validation",
      "Communicate targets publicly",
      "Report progress annually",
    ],
  },
  ecovadis: {
    name: "EcoVadis",
    description: "Business sustainability ratings for supply chains",
    icon: Leaf,
    color: "text-lime-600",
    bgColor: "bg-lime-100",
    milestones: [
      "Complete questionnaire",
      "Upload supporting documents",
      "Submit for assessment",
      "Review scorecard",
      "Implement improvement actions",
      "Request reassessment",
    ],
  },
  sec: {
    name: "SEC Climate",
    description: "US Securities and Exchange Commission climate disclosure rules",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
    milestones: [
      "Assess applicability",
      "Establish disclosure controls",
      "Calculate required emissions",
      "Prepare climate risk disclosures",
      "Obtain assurance",
      "File with SEC",
    ],
  },
  issb: {
    name: "ISSB",
    description: "International Sustainability Standards Board global baseline",
    icon: Globe,
    color: "text-sky-600",
    bgColor: "bg-sky-100",
    milestones: [
      "Map IFRS S1 & S2 requirements",
      "Conduct materiality assessment",
      "Collect required disclosures",
      "Prepare ISSB-aligned report",
      "Integrate with financial statements",
      "Obtain external review",
    ],
  },
};

type CertificationType = keyof typeof CERTIFICATION_INFO;

export default function Certifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCertType, setSelectedCertType] = useState<CertificationType | null>(null);
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: certifications, isLoading } = useQuery({
    queryKey: ["userCertifications", userProfile?.id],
    queryFn: async () => {
      if (!userProfile) return [];
      const { data, error } = await supabase
        .from("user_certifications")
        .select("*, certification_milestones(*)")
        .eq("user_id", userProfile.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });

  const addCertificationMutation = useMutation({
    mutationFn: async (certType: CertificationType) => {
      if (!userProfile) throw new Error("User not found");
      
      const { data: cert, error: certError } = await supabase
        .from("user_certifications")
        .insert({
          user_id: userProfile.id,
          certification_type: certType,
          status: "in_progress",
          target_date: targetDate || null,
          notes: notes || null,
        })
        .select()
        .single();
      
      if (certError) throw certError;

      const milestones = CERTIFICATION_INFO[certType].milestones.map((title, index) => ({
        user_certification_id: cert.id,
        title,
        order_index: index,
      }));

      const { error: milestonesError } = await supabase
        .from("certification_milestones")
        .insert(milestones);

      if (milestonesError) throw milestonesError;

      return cert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCertifications"] });
      toast.success("Certification added successfully!");
      setAddDialogOpen(false);
      setSelectedCertType(null);
      setTargetDate("");
      setNotes("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add certification");
    },
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: async ({ milestoneId, completed }: { milestoneId: string; completed: boolean }) => {
      const { error } = await supabase
        .from("certification_milestones")
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", milestoneId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCertifications"] });
    },
  });

  const existingCertTypes = certifications?.map((c) => c.certification_type) || [];
  const availableCertTypes = (Object.keys(CERTIFICATION_INFO) as CertificationType[]).filter(
    (key) => !existingCertTypes.includes(key)
  );

  const getCertificationProgress = (cert: any) => {
    if (!cert.certification_milestones?.length) return 0;
    const completed = cert.certification_milestones.filter((m: any) => m.is_completed).length;
    return Math.round((completed / cert.certification_milestones.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Climate Certifications</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress toward B Corp, CDP, GRI, CSRD, and other certifications
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Start a New Certification</DialogTitle>
                <DialogDescription>
                  Select a certification to begin tracking your progress
                </DialogDescription>
              </DialogHeader>
              {!selectedCertType ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {availableCertTypes.map((key) => {
                    const info = CERTIFICATION_INFO[key];
                    const Icon = info.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCertType(key)}
                        className="flex items-start gap-3 p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-lg ${info.bgColor}`}>
                          <Icon className={`h-5 w-5 ${info.color}`} />
                        </div>
                        <div>
                          <div className="font-medium">{info.name}</div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {info.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    {(() => {
                      const info = CERTIFICATION_INFO[selectedCertType];
                      const Icon = info.icon;
                      return (
                        <>
                          <div className={`p-2 rounded-lg ${info.bgColor}`}>
                            <Icon className={`h-5 w-5 ${info.color}`} />
                          </div>
                          <div>
                            <div className="font-medium">{info.name}</div>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-date">Target Completion Date (Optional)</Label>
                    <Input
                      id="target-date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific goals or context for this certification..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCertType(null)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => addCertificationMutation.mutate(selectedCertType)}
                      disabled={addCertificationMutation.isPending}
                      className="flex-1"
                    >
                      {addCertificationMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Start Tracking
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

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
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : certifications?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No certifications yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your journey toward climate certifications
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Certification
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications?.map((cert) => {
              const info = CERTIFICATION_INFO[cert.certification_type as CertificationType];
              const Icon = info?.icon || Award;
              const progress = getCertificationProgress(cert);
              
              return (
                <Card key={cert.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${info?.bgColor || "bg-muted"}`}>
                          <Icon className={`h-6 w-6 ${info?.color || "text-foreground"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{info?.name || cert.certification_type}</CardTitle>
                          <CardDescription className="line-clamp-1">
                            {info?.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={progress === 100 ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {progress === 100 ? "Completed" : `${progress}%`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {cert.target_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Target: {new Date(cert.target_date).toLocaleDateString()}
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Milestones</p>
                      <div className="space-y-1">
                        {cert.certification_milestones
                          ?.sort((a: any, b: any) => a.order_index - b.order_index)
                          .map((milestone: any) => (
                            <button
                              key={milestone.id}
                              onClick={() =>
                                toggleMilestoneMutation.mutate({
                                  milestoneId: milestone.id,
                                  completed: !milestone.is_completed,
                                })
                              }
                              className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-muted transition-colors text-left"
                            >
                              {milestone.is_completed ? (
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span
                                className={`text-sm ${
                                  milestone.is_completed
                                    ? "text-muted-foreground line-through"
                                    : ""
                                }`}
                              >
                                {milestone.title}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Reference Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Certification Framework Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CERTIFICATION_INFO).map(([key, info]) => {
              const Icon = info.icon;
              return (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${info.bgColor}`}>
                        <Icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{info.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
