import { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  Target, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Loader2,
  Sparkles,
  FileText,
  Zap,
  TreePine,
  TrendingDown,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidedOnboardingProps {
  open?: boolean;
  onComplete?: () => void;
}

const STEPS = [
  { 
    id: 1, 
    title: 'Welcome',
    subtitle: "Let's personalize your experience",
    icon: Sparkles,
    tip: 'This will take about 2 minutes'
  },
  { 
    id: 2, 
    title: 'Your Company',
    subtitle: 'Tell us about your business',
    icon: Building2,
    tip: 'We use this to customize emission factors'
  },
  { 
    id: 3, 
    title: 'Team Size',
    subtitle: 'How big is your organization?',
    icon: Users,
    tip: 'This helps estimate your baseline'
  },
  { 
    id: 4, 
    title: 'Industry',
    subtitle: 'What sector are you in?',
    icon: FileText,
    tip: 'Industry-specific benchmarks will be applied'
  },
  { 
    id: 5, 
    title: 'Primary Goal',
    subtitle: 'What brings you here?',
    icon: Target,
    tip: "We'll prioritize features based on your goal"
  },
  { 
    id: 6, 
    title: 'Ready!',
    subtitle: 'Your dashboard is ready',
    icon: Zap,
    tip: ''
  },
];

const INDUSTRIES = [
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭', emission: 'High' },
  { value: 'it_services', label: 'IT & Software', icon: '💻', emission: 'Low-Medium' },
  { value: 'logistics', label: 'Logistics & Transport', icon: '🚚', emission: 'High' },
  { value: 'retail', label: 'Retail & E-commerce', icon: '🛒', emission: 'Medium' },
  { value: 'hospitality', label: 'Hotels & Hospitality', icon: '🏨', emission: 'Medium' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', emission: 'Medium' },
  { value: 'construction', label: 'Construction', icon: '🏗️', emission: 'High' },
  { value: 'agriculture', label: 'Agriculture & Food', icon: '🌾', emission: 'Medium' },
  { value: 'financial', label: 'Banking & Finance', icon: '🏦', emission: 'Low' },
  { value: 'education', label: 'Education', icon: '🎓', emission: 'Low' },
  { value: 'heavy_industry', label: 'Steel, Cement, Chemicals', icon: '⚙️', emission: 'Very High' },
  { value: 'energy', label: 'Energy & Utilities', icon: '⚡', emission: 'Very High' },
];

const COMPANY_SIZES = [
  { value: 'startup', label: '1-50', sublabel: 'Startup', icon: '🌱' },
  { value: 'small', label: '51-200', sublabel: 'Small', icon: '🌿' },
  { value: 'medium', label: '201-1000', sublabel: 'Medium', icon: '🌳' },
  { value: 'large', label: '1001-5000', sublabel: 'Large', icon: '🏢' },
  { value: 'enterprise', label: '5000+', sublabel: 'Enterprise', icon: '🏙️' },
];

const GOALS = [
  { 
    value: 'brsr_compliance', 
    label: 'BRSR Compliance', 
    description: 'Meet SEBI reporting requirements',
    icon: FileText 
  },
  { 
    value: 'reduce_emissions', 
    label: 'Reduce Emissions', 
    description: 'Track and lower carbon footprint',
    icon: TrendingDown 
  },
  { 
    value: 'offset_carbon', 
    label: 'Offset Carbon', 
    description: 'Purchase verified carbon credits',
    icon: TreePine 
  },
  { 
    value: 'investor_reporting', 
    label: 'Investor Reporting', 
    description: 'ESG disclosures for stakeholders',
    icon: FileText 
  },
  { 
    value: 'explore', 
    label: 'Just Exploring', 
    description: 'Learn about carbon accounting',
    icon: Lightbulb 
  },
];

export function GuidedOnboarding({ open: controlledOpen, onComplete }: GuidedOnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [direction, setDirection] = useState(0);

  const [settings, setSettings] = useState({
    company_name: '',
    industry_type: '',
    company_size: '',
    primary_goal: '',
  });

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('organization_settings')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking onboarding:', error);
      setHasCompletedOnboarding(false);
      if (controlledOpen === undefined) {
        setIsOpen(true);
      }
      return;
    }

    if (!data) {
      setHasCompletedOnboarding(false);
      if (controlledOpen === undefined) {
        setIsOpen(true);
      }
    } else {
      setHasCompletedOnboarding(data.onboarding_completed);
      if (!data.onboarding_completed && controlledOpen === undefined) {
        setIsOpen(true);
      }
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);

    const { error } = await (supabase.from('organization_settings') as any).upsert({
      user_id: user.id,
      company_name: settings.company_name,
      industry_type: settings.industry_type,
      company_size: settings.company_size,
      onboarding_completed: true,
    }, { onConflict: 'user_id' });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to save settings' });
      setIsLoading(false);
      return;
    }

    await supabase.from('users').update({
      company_name: settings.company_name,
      industry_type: settings.industry_type,
    }).eq('user_id', user.id);

    toast({ title: '🎉 Setup complete!', description: 'Your dashboard is ready' });
    setIsOpen(false);
    setHasCompletedOnboarding(true);
    
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const goNext = () => {
    setDirection(1);
    if (step === STEPS.length) {
      handleComplete();
    } else {
      setStep(s => Math.min(s + 1, STEPS.length));
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return settings.company_name.length >= 2;
      case 3:
        return !!settings.company_size;
      case 4:
        return !!settings.industry_type;
      case 5:
        return !!settings.primary_goal;
      case 6:
        return true;
      default:
        return false;
    }
  };

  if (hasCompletedOnboarding === null || hasCompletedOnboarding) {
    return null;
  }

  const currentStep = STEPS[step - 1];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-gradient-to-b from-background to-muted/30" aria-describedby="guided-onboarding-description">
        <VisuallyHidden>
          <DialogTitle>Welcome Setup</DialogTitle>
          <DialogDescription id="guided-onboarding-description">Personalize your Zero Graph experience</DialogDescription>
        </VisuallyHidden>
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {STEPS.slice(0, -1).map((s, idx) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  step > idx + 1 ? 'bg-primary' : 
                  step === idx + 1 ? 'bg-primary w-6' : 
                  'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Step {Math.min(step, STEPS.length - 1)} of {STEPS.length - 1}
          </span>
        </div>

        <div className="px-6 pb-6 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-1"
            >
              {/* Step Content */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <currentStep.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                <p className="text-muted-foreground mt-1">{currentStep.subtitle}</p>
                {currentStep.tip && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    {currentStep.tip}
                  </p>
                )}
              </div>

              {/* Step 1: Welcome */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl mb-1">📊</div>
                      <p className="text-sm font-medium">Track Emissions</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl mb-1">📋</div>
                      <p className="text-sm font-medium">BRSR Reports</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl mb-1">🌱</div>
                      <p className="text-sm font-medium">Offset Carbon</p>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    Answer a few quick questions to personalize your Zero Graph experience
                  </p>
                </div>
              )}

              {/* Step 2: Company Name */}
              {step === 2 && (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div>
                    <Label className="text-base">What's your company name?</Label>
                    <Input
                      value={settings.company_name}
                      onChange={e => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter your company name"
                      className="mt-2 h-12 text-lg"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Company Size */}
              {step === 3 && (
                <div className="space-y-4">
                  <Label className="text-base block text-center">How many employees?</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {COMPANY_SIZES.map(size => (
                      <Card
                        key={size.value}
                        className={`cursor-pointer transition-all text-center p-4 ${
                          settings.company_size === size.value 
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettings(prev => ({ ...prev, company_size: size.value }))}
                      >
                        <div className="text-2xl mb-1">{size.icon}</div>
                        <p className="font-bold text-lg">{size.label}</p>
                        <p className="text-xs text-muted-foreground">{size.sublabel}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Industry */}
              {step === 4 && (
                <div className="space-y-4">
                  <Label className="text-base block text-center">What industry are you in?</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {INDUSTRIES.map(ind => (
                      <Card
                        key={ind.value}
                        className={`cursor-pointer transition-all p-3 ${
                          settings.industry_type === ind.value 
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettings(prev => ({ ...prev, industry_type: ind.value }))}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ind.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{ind.label}</p>
                            <p className="text-xs text-muted-foreground">{ind.emission} emissions</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Primary Goal */}
              {step === 5 && (
                <div className="space-y-4">
                  <Label className="text-base block text-center">What's your primary goal?</Label>
                  <RadioGroup
                    value={settings.primary_goal}
                    onValueChange={val => setSettings(prev => ({ ...prev, primary_goal: val }))}
                    className="space-y-2"
                  >
                    {GOALS.map(goal => (
                      <Card
                        key={goal.value}
                        className={`cursor-pointer transition-all ${
                          settings.primary_goal === goal.value 
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettings(prev => ({ ...prev, primary_goal: goal.value }))}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <RadioGroupItem value={goal.value} id={goal.value} />
                          <div className="p-2 rounded-lg bg-muted">
                            <goal.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{goal.label}</p>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 6: Ready */}
              {step === 6 && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">You're all set, {settings.company_name}!</h3>
                    <p className="text-muted-foreground mt-2">
                      Your personalized dashboard is ready with industry-specific emission factors
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="font-medium">{INDUSTRIES.find(i => i.value === settings.industry_type)?.label}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Goal</p>
                      <p className="font-medium">{GOALS.find(g => g.value === settings.primary_goal)?.label}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={goNext}
              disabled={!canProceed() || isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === STEPS.length ? (
                'Go to Dashboard'
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
