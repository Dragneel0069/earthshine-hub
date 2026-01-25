import { useState, useEffect } from 'react';
import { Building2, Calendar, MapPin, Users, Target, Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
}

interface OrganizationSettings {
  name: string;
  sector: string;
  employee_count: number | null;
  baseline_year: number;
  financial_year_start: string;
  state: string;
  city: string;
}

const INDUSTRY_TYPES = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'it_services', label: 'IT & Software Services' },
  { value: 'logistics', label: 'Logistics & Transport' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'construction', label: 'Construction & Real Estate' },
  { value: 'agriculture', label: 'Agriculture & Food Processing' },
  { value: 'financial_services', label: 'Banking & Financial Services' },
  { value: 'education', label: 'Education' },
  { value: 'heavy_industry', label: 'Heavy Industry (Steel, Cement, Chemicals)' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'other', label: 'Other' },
];

const COMPANY_SIZES = [
  { value: 50, label: 'Startup (1-50 employees)', employees: '1-50' },
  { value: 200, label: 'Small (51-200 employees)', employees: '51-200' },
  { value: 1000, label: 'Medium (201-1000 employees)', employees: '201-1000' },
  { value: 5000, label: 'Large (1001-5000 employees)', employees: '1001-5000' },
  { value: 10000, label: 'Enterprise (5000+ employees)', employees: '5000+' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Other',
];

const STEPS = [
  { id: 1, title: 'Organization Info', icon: Building2 },
  { id: 2, title: 'Industry & Size', icon: Users },
  { id: 3, title: 'Baseline Year', icon: Calendar },
  { id: 4, title: 'Location', icon: MapPin },
  { id: 5, title: 'Review', icon: Target },
];

interface OnboardingWizardProps {
  open?: boolean;
  onComplete?: () => void;
}

export function OnboardingWizard({ open: controlledOpen, onComplete }: OnboardingWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  const [settings, setSettings] = useState<OrganizationSettings>({
    name: '',
    sector: '',
    employee_count: null,
    baseline_year: new Date().getFullYear() - 1,
    financial_year_start: 'April',
    state: '',
    city: '',
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
    
    // Check if user has any organizations
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('org_id')
      .eq('user_id', user.id)
      .limit(1);

    if (!memberships || memberships.length === 0) {
      setHasCompletedOnboarding(false);
      if (controlledOpen === undefined) {
        setIsOpen(true);
      }
    } else {
      setHasCompletedOnboarding(true);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);

    try {
      // Create organization with all settings
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: settings.name,
          sector: settings.sector,
          employee_count: settings.employee_count,
          baseline_year: settings.baseline_year,
          financial_year_start: settings.financial_year_start,
          state: settings.state,
          city: settings.city,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Trigger auto-adds user as admin via database trigger
      
      toast({ title: 'Setup complete!', description: 'Welcome to Zero Graph' });
      setIsOpen(false);
      setHasCompletedOnboarding(true);
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({ variant: 'destructive', title: 'Failed to save settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return settings.name.length >= 2;
      case 2:
        return settings.sector && settings.employee_count;
      case 3:
        return settings.baseline_year && settings.financial_year_start;
      case 4:
        return true; // Location is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  if (hasCompletedOnboarding === null || hasCompletedOnboarding) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden" aria-describedby="onboarding-wizard-description">
        <VisuallyHidden>
          <DialogTitle>Onboarding Wizard</DialogTitle>
          <DialogDescription id="onboarding-wizard-description">Set up your carbon accounting platform</DialogDescription>
        </VisuallyHidden>
        
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <h2 className="text-xl font-bold mb-2">Welcome to Zero Graph</h2>
          <p className="text-sm opacity-90">Let's set up your organization</p>
          <Progress value={progress} className="mt-4 bg-primary-foreground/20" />
          <div className="flex justify-between mt-2">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`flex items-center gap-1 text-xs ${step >= s.id ? 'opacity-100' : 'opacity-50'}`}
              >
                <s.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Organization Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Tell us about your organization</h3>
                <p className="text-sm text-muted-foreground">This helps us customize your experience</p>
              </div>
              <div>
                <Label>Organization Name *</Label>
                <Input
                  value={settings.name}
                  onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your organization name"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Industry & Size */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Industry & Organization Size</h3>
                <p className="text-sm text-muted-foreground">We'll use India-specific emission factors for your sector</p>
              </div>
              <div>
                <Label>Industry Type *</Label>
                <Select
                  value={settings.sector}
                  onValueChange={val => setSettings(prev => ({ ...prev, sector: val }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_TYPES.map(ind => (
                      <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Organization Size *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {COMPANY_SIZES.map(size => (
                    <Card
                      key={size.value}
                      className={`cursor-pointer transition-all ${settings.employee_count === size.value ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      onClick={() => setSettings(prev => ({ ...prev, employee_count: size.value }))}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{size.employees} employees</p>
                        </div>
                        {settings.employee_count === size.value && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Baseline Year */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Calendar className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Reporting Period</h3>
                <p className="text-sm text-muted-foreground">Set your baseline year for tracking progress</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Baseline Year *</Label>
                  <Select
                    value={settings.baseline_year.toString()}
                    onValueChange={val => setSettings(prev => ({ ...prev, baseline_year: parseInt(val) }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Your emissions reduction progress will be measured from this year</p>
                </div>
                <div>
                  <Label>Financial Year Starts *</Label>
                  <Select
                    value={settings.financial_year_start}
                    onValueChange={val => setSettings(prev => ({ ...prev, financial_year_start: val }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="April">April (Indian FY)</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">April is standard for BRSR reporting</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Primary Location</h3>
                <p className="text-sm text-muted-foreground">Where is your organization based?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  <Select
                    value={settings.state}
                    onValueChange={val => setSettings(prev => ({ ...prev, state: val }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={settings.city}
                    onChange={e => setSettings(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Review & Complete</h3>
                <p className="text-sm text-muted-foreground">Confirm your organization details</p>
              </div>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organization</span>
                    <span className="font-medium">{settings.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{INDUSTRY_TYPES.find(i => i.value === settings.sector)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Baseline Year</span>
                    <span className="font-medium">{settings.baseline_year}</span>
                  </div>
                  {settings.state && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{settings.city ? `${settings.city}, ` : ''}{settings.state}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setStep(s => Math.max(s - 1, 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={() => {
                if (step === STEPS.length) {
                  handleComplete();
                } else {
                  setStep(s => Math.min(s + 1, STEPS.length));
                }
              }}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === STEPS.length ? (
                'Complete Setup'
              ) : (
                <>
                  Next
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
