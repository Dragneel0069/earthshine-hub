import { useState, useEffect } from 'react';
import { Building2, Calendar, MapPin, Users, Target, Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  company_name: string;
  industry_type: string;
  company_size: string;
  baseline_year: number;
  financial_year_start: string;
  locations: Location[];
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
  { value: 'startup', label: 'Startup (1-50 employees)', employees: '1-50' },
  { value: 'small', label: 'Small (51-200 employees)', employees: '51-200' },
  { value: 'medium', label: 'Medium (201-1000 employees)', employees: '201-1000' },
  { value: 'large', label: 'Large (1001-5000 employees)', employees: '1001-5000' },
  { value: 'enterprise', label: 'Enterprise (5000+ employees)', employees: '5000+' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Other',
];

const LOCATION_TYPES = [
  { value: 'headquarters', label: 'Headquarters' },
  { value: 'office', label: 'Office' },
  { value: 'factory', label: 'Factory / Manufacturing Plant' },
  { value: 'warehouse', label: 'Warehouse / Distribution Center' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'data_center', label: 'Data Center' },
  { value: 'other', label: 'Other Facility' },
];

const STEPS = [
  { id: 1, title: 'Company Info', icon: Building2 },
  { id: 2, title: 'Industry & Size', icon: Users },
  { id: 3, title: 'Baseline Year', icon: Calendar },
  { id: 4, title: 'Locations', icon: MapPin },
  { id: 5, title: 'Goals', icon: Target },
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
    company_name: '',
    industry_type: '',
    company_size: '',
    baseline_year: new Date().getFullYear() - 1,
    financial_year_start: 'April',
    locations: [],
  });

  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    city: '',
    state: '',
    type: '',
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

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.city || !newLocation.state || !newLocation.type) {
      toast({ variant: 'destructive', title: 'Please fill all location fields' });
      return;
    }

    setSettings(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        { ...newLocation, id: crypto.randomUUID() } as Location,
      ],
    }));

    setNewLocation({ name: '', city: '', state: '', type: '' });
  };

  const handleRemoveLocation = (id: string) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.id !== id),
    }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);

    // Using type assertion since the types file hasn't regenerated yet
    const { error } = await (supabase.from('organization_settings') as any).upsert({
      user_id: user.id,
      company_name: settings.company_name,
      industry_type: settings.industry_type,
      company_size: settings.company_size,
      baseline_year: settings.baseline_year,
      financial_year_start: settings.financial_year_start,
      locations: settings.locations,
      onboarding_completed: true,
    }, { onConflict: 'user_id' });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to save settings' });
      setIsLoading(false);
      return;
    }

    // Also update the users table with company info
    await supabase.from('users').update({
      company_name: settings.company_name,
      industry_type: settings.industry_type,
      state: settings.locations[0]?.state || null,
      city: settings.locations[0]?.city || null,
    }).eq('user_id', user.id);

    toast({ title: 'Setup complete!', description: 'Welcome to Zero Graph' });
    setIsOpen(false);
    setHasCompletedOnboarding(true);
    
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  const progress = (step / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return settings.company_name.length >= 2;
      case 2:
        return settings.industry_type && settings.company_size;
      case 3:
        return settings.baseline_year && settings.financial_year_start;
      case 4:
        return true; // Locations are optional
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
          <p className="text-sm opacity-90">Let's set up your carbon accounting platform</p>
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
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Tell us about your company</h3>
                <p className="text-sm text-muted-foreground">This helps us customize your experience</p>
              </div>
              <div>
                <Label>Company Name *</Label>
                <Input
                  value={settings.company_name}
                  onChange={e => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Enter your company name"
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
                <h3 className="text-lg font-semibold">Industry & Company Size</h3>
                <p className="text-sm text-muted-foreground">We'll use India-specific emission factors for your sector</p>
              </div>
              <div>
                <Label>Industry Type *</Label>
                <Select
                  value={settings.industry_type}
                  onValueChange={val => setSettings(prev => ({ ...prev, industry_type: val }))}
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
                <Label>Company Size *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {COMPANY_SIZES.map(size => (
                    <Card
                      key={size.value}
                      className={`cursor-pointer transition-all ${settings.company_size === size.value ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      onClick={() => setSettings(prev => ({ ...prev, company_size: size.value }))}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{size.value.charAt(0).toUpperCase() + size.value.slice(1)}</p>
                          <p className="text-xs text-muted-foreground">{size.employees} employees</p>
                        </div>
                        {settings.company_size === size.value && (
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

          {/* Step 4: Locations */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Business Locations</h3>
                <p className="text-sm text-muted-foreground">Add your facilities for multi-site emissions tracking</p>
              </div>

              {settings.locations.length > 0 && (
                <div className="space-y-2 mb-4">
                  {settings.locations.map(loc => (
                    <div key={loc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-sm text-muted-foreground">{loc.city}, {loc.state}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{LOCATION_TYPES.find(t => t.value === loc.type)?.label}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => handleRemoveLocation(loc.id)}>×</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Add Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Location Name</Label>
                      <Input
                        value={newLocation.name}
                        onChange={e => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Main Office"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={newLocation.type}
                        onValueChange={val => setNewLocation(prev => ({ ...prev, type: val }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input
                        value={newLocation.city}
                        onChange={e => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="e.g., Mumbai"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">State</Label>
                      <Select
                        value={newLocation.state}
                        onValueChange={val => setNewLocation(prev => ({ ...prev, state: val }))}
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
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddLocation} className="w-full">
                    Add Location
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Goals */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">You're all set!</h3>
                <p className="text-sm text-muted-foreground">Review your setup and start tracking emissions</p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{settings.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{INDUSTRY_TYPES.find(i => i.value === settings.industry_type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">{COMPANY_SIZES.find(s => s.value === settings.company_size)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Baseline Year</span>
                    <span className="font-medium">FY {settings.baseline_year}-{settings.baseline_year + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Locations</span>
                    <span className="font-medium">{settings.locations.length} sites</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Import your emissions data via CSV</li>
                  <li>• Set up your Scope 3 supplier tracking</li>
                  <li>• Generate your first BRSR report</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            {step < STEPS.length ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
