import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Target,
  Leaf,
  Building2,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";

interface Question {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "emissions_tracking",
    category: "Measurement",
    question: "How do you currently track your carbon emissions?",
    options: [
      { value: "none", label: "We don't track emissions", score: 0 },
      { value: "basic", label: "Basic spreadsheets or estimates", score: 1 },
      { value: "partial", label: "Track Scope 1 & 2 only", score: 2 },
      { value: "comprehensive", label: "Track all Scopes (1, 2, & 3)", score: 3 },
    ],
  },
  {
    id: "data_collection",
    category: "Measurement",
    question: "How often do you collect emissions data?",
    options: [
      { value: "never", label: "Never or rarely", score: 0 },
      { value: "annual", label: "Annually", score: 1 },
      { value: "quarterly", label: "Quarterly", score: 2 },
      { value: "monthly", label: "Monthly or more frequently", score: 3 },
    ],
  },
  {
    id: "reduction_targets",
    category: "Strategy",
    question: "Do you have emissions reduction targets?",
    options: [
      { value: "none", label: "No targets set", score: 0 },
      { value: "informal", label: "Informal or internal goals", score: 1 },
      { value: "formal", label: "Formal targets, not science-based", score: 2 },
      { value: "sbti", label: "Science-based targets (SBTi approved)", score: 3 },
    ],
  },
  {
    id: "reduction_initiatives",
    category: "Strategy",
    question: "What reduction initiatives have you implemented?",
    options: [
      { value: "none", label: "No initiatives yet", score: 0 },
      { value: "basic", label: "Basic efficiency measures", score: 1 },
      { value: "moderate", label: "Renewable energy or fleet improvements", score: 2 },
      { value: "comprehensive", label: "Comprehensive decarbonization program", score: 3 },
    ],
  },
  {
    id: "offsetting",
    category: "Offsetting",
    question: "Do you purchase carbon offsets or RECs?",
    options: [
      { value: "none", label: "No offsetting activities", score: 0 },
      { value: "occasional", label: "Occasional or ad-hoc purchases", score: 1 },
      { value: "regular", label: "Regular offsetting program", score: 2 },
      { value: "netZero", label: "Working toward net-zero with verified offsets", score: 3 },
    ],
  },
  {
    id: "reporting",
    category: "Reporting",
    question: "What sustainability reporting do you do?",
    options: [
      { value: "none", label: "No formal reporting", score: 0 },
      { value: "internal", label: "Internal reports only", score: 1 },
      { value: "voluntary", label: "Voluntary public disclosure", score: 2 },
      { value: "mandatory", label: "Comply with mandatory frameworks (CSRD, SEC, etc.)", score: 3 },
    ],
  },
  {
    id: "certifications",
    category: "Reporting",
    question: "Do you hold any sustainability certifications?",
    options: [
      { value: "none", label: "No certifications", score: 0 },
      { value: "working", label: "Working toward certification", score: 1 },
      { value: "one", label: "One certification (B Corp, EcoVadis, etc.)", score: 2 },
      { value: "multiple", label: "Multiple certifications", score: 3 },
    ],
  },
  {
    id: "governance",
    category: "Governance",
    question: "How is sustainability governed in your organization?",
    options: [
      { value: "none", label: "No formal governance", score: 0 },
      { value: "assigned", label: "Assigned to existing role", score: 1 },
      { value: "dedicated", label: "Dedicated sustainability role/team", score: 2 },
      { value: "board", label: "Board-level oversight and dedicated team", score: 3 },
    ],
  },
  {
    id: "supply_chain",
    category: "Supply Chain",
    question: "How do you engage suppliers on sustainability?",
    options: [
      { value: "none", label: "No supplier engagement", score: 0 },
      { value: "awareness", label: "Basic awareness or requests", score: 1 },
      { value: "requirements", label: "Include sustainability in contracts", score: 2 },
      { value: "collaboration", label: "Active collaboration and monitoring", score: 3 },
    ],
  },
  {
    id: "employee_engagement",
    category: "Culture",
    question: "How engaged are employees in sustainability?",
    options: [
      { value: "none", label: "Limited awareness", score: 0 },
      { value: "communication", label: "Regular communication on initiatives", score: 1 },
      { value: "programs", label: "Employee sustainability programs", score: 2 },
      { value: "embedded", label: "Sustainability embedded in culture and KPIs", score: 3 },
    ],
  },
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Measurement: BarChart3,
  Strategy: Target,
  Offsetting: Leaf,
  Reporting: FileText,
  Governance: Building2,
  "Supply Chain": TrendingUp,
  Culture: Users,
};

export default function SustainabilityQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [QUESTIONS[currentQuestion].id]: value,
    }));
  };

  const goNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let total = 0;
    const maxScore = QUESTIONS.length * 3;
    
    QUESTIONS.forEach((q) => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find((o) => o.value === answer);
        if (option) {
          total += option.score;
        }
      }
    });

    return Math.round((total / maxScore) * 100);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Leader", color: "text-green-600", bgColor: "bg-green-100" };
    if (score >= 60) return { label: "Progressing", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (score >= 40) return { label: "Developing", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (score >= 20) return { label: "Beginning", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { label: "Getting Started", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const getRecommendations = (score: number) => {
    const recs = [];
    
    if (!answers.emissions_tracking || answers.emissions_tracking === "none" || answers.emissions_tracking === "basic") {
      recs.push({
        title: "Start Carbon Tracking",
        description: "Implement comprehensive emissions tracking across all scopes",
        action: "/dashboard",
        actionLabel: "Go to Dashboard",
      });
    }

    if (!answers.reduction_targets || answers.reduction_targets === "none" || answers.reduction_targets === "informal") {
      recs.push({
        title: "Set Science-Based Targets",
        description: "Develop formal, science-based emissions reduction targets",
        action: "/certifications",
        actionLabel: "Explore SBTi",
      });
    }

    if (!answers.reporting || answers.reporting === "none" || answers.reporting === "internal") {
      recs.push({
        title: "Enhance Reporting",
        description: "Prepare BRSR or CSRD-compliant sustainability reports",
        action: "/reports",
        actionLabel: "Generate Reports",
      });
    }

    if (!answers.offsetting || answers.offsetting === "none") {
      recs.push({
        title: "Explore Carbon Offsets",
        description: "Purchase verified carbon credits to offset unavoidable emissions",
        action: "/marketplace",
        actionLabel: "Browse Marketplace",
      });
    }

    if (!answers.certifications || answers.certifications === "none") {
      recs.push({
        title: "Pursue Certifications",
        description: "Work toward B Corp, EcoVadis, or other climate certifications",
        action: "/certifications",
        actionLabel: "Track Certifications",
      });
    }

    return recs.slice(0, 4);
  };

  const submitQuiz = async () => {
    setSaving(true);
    const score = calculateScore();
    const recommendations = getRecommendations(score);

    try {
      let userId = null;
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id")
          .eq("user_id", user.id)
          .single();
        userId = profile?.id;
      }

      await supabase.from("quiz_responses").insert({
        user_id: userId,
        session_id: crypto.randomUUID(),
        quiz_type: "sustainability_readiness",
        responses: answers,
        score,
        recommendations,
      });

      setShowResults(true);
    } catch (error) {
      console.error("Failed to save quiz:", error);
      toast.error("Failed to save your results, but here they are!");
      setShowResults(true);
    } finally {
      setSaving(false);
    }
  };

  const score = calculateScore();
  const scoreInfo = getScoreLabel(score);
  const recommendations = getRecommendations(score);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 max-w-3xl">
          <Card className="overflow-hidden">
            <div className={`${scoreInfo.bgColor} p-8 text-center`}>
              <CheckCircle2 className={`h-16 w-16 mx-auto mb-4 ${scoreInfo.color}`} />
              <h1 className="text-3xl font-bold mb-2">Your Sustainability Score</h1>
              <div className={`text-6xl font-bold ${scoreInfo.color} mb-2`}>{score}%</div>
              <div className={`inline-block px-4 py-1 rounded-full ${scoreInfo.bgColor} ${scoreInfo.color} font-medium`}>
                {scoreInfo.label}
              </div>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Personalized Recommendations</h2>
                  <div className="grid gap-4">
                    {recommendations.map((rec, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{rec.title}</h3>
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                            </div>
                            <Button size="sm" asChild>
                              <a href={rec.action}>{rec.actionLabel}</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button onClick={() => navigate("/signup")} className="flex-1">
                    Create Account to Save Results
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }} className="flex-1">
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const CategoryIcon = CATEGORY_ICONS[question.category] || Target;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CategoryIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {question.category}
              </span>
            </div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer py-3 px-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={goNext}
                disabled={!answers[question.id] || saving}
              >
                {currentQuestion === QUESTIONS.length - 1 ? (
                  saving ? "Saving..." : "See Results"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
