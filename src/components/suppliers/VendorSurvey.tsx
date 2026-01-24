import { useState } from 'react';
import { 
  Send, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Building2,
  Leaf,
  Zap,
  Truck,
  Factory,
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  questions: number;
  estimatedTime: string;
  category: string;
}

interface SentSurvey {
  id: string;
  supplierName: string;
  supplierEmail: string;
  template: string;
  status: 'sent' | 'viewed' | 'in_progress' | 'completed' | 'expired';
  sentAt: string;
  dueDate: string;
  completedAt?: string;
  score?: number;
}

const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: 'emissions_basic',
    name: 'Basic Emissions Survey',
    description: 'Collect Scope 1 & 2 emissions data from suppliers',
    icon: <Leaf className="h-5 w-5" />,
    questions: 8,
    estimatedTime: '10 min',
    category: 'emissions',
  },
  {
    id: 'emissions_detailed',
    name: 'Detailed Emissions Assessment',
    description: 'Comprehensive Scope 1, 2 & 3 with methodology details',
    icon: <BarChart3 className="h-5 w-5" />,
    questions: 25,
    estimatedTime: '30 min',
    category: 'emissions',
  },
  {
    id: 'sustainability',
    name: 'Sustainability Practices',
    description: 'Assess overall sustainability initiatives and certifications',
    icon: <Factory className="h-5 w-5" />,
    questions: 15,
    estimatedTime: '20 min',
    category: 'sustainability',
  },
  {
    id: 'transport_logistics',
    name: 'Transport & Logistics',
    description: 'Focused on transportation and delivery emissions',
    icon: <Truck className="h-5 w-5" />,
    questions: 12,
    estimatedTime: '15 min',
    category: 'transport',
  },
  {
    id: 'energy_audit',
    name: 'Energy Usage Audit',
    description: 'Detailed energy consumption and renewable energy mix',
    icon: <Zap className="h-5 w-5" />,
    questions: 18,
    estimatedTime: '25 min',
    category: 'energy',
  },
];

const MOCK_SENT_SURVEYS: SentSurvey[] = [
  {
    id: '1',
    supplierName: 'Tata Steel Ltd',
    supplierEmail: 'sustainability@tatasteel.com',
    template: 'Detailed Emissions Assessment',
    status: 'completed',
    sentAt: '2024-01-10',
    dueDate: '2024-02-10',
    completedAt: '2024-01-25',
    score: 85,
  },
  {
    id: '2',
    supplierName: 'Reliance Industries',
    supplierEmail: 'esg@ril.com',
    template: 'Sustainability Practices',
    status: 'in_progress',
    sentAt: '2024-01-15',
    dueDate: '2024-02-15',
  },
  {
    id: '3',
    supplierName: 'Mahindra Logistics',
    supplierEmail: 'carbon@mahindra.com',
    template: 'Transport & Logistics',
    status: 'viewed',
    sentAt: '2024-01-18',
    dueDate: '2024-02-18',
  },
  {
    id: '4',
    supplierName: 'Infosys Limited',
    supplierEmail: 'sustainability@infosys.com',
    template: 'Energy Usage Audit',
    status: 'sent',
    sentAt: '2024-01-20',
    dueDate: '2024-02-20',
  },
];

export function VendorSurvey() {
  const { toast } = useToast();
  const [sentSurveys, setSentSurveys] = useState<SentSurvey[]>(MOCK_SENT_SURVEYS);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [bulkEmails, setBulkEmails] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [dueInDays, setDueInDays] = useState('30');
  const [sendReminders, setSendReminders] = useState(true);

  const handleSendSurvey = () => {
    if (!selectedTemplate) return;
    
    const emails = bulkEmails.split('\n').filter(e => e.trim());
    
    toast({
      title: 'Surveys Sent!',
      description: `${emails.length} survey invitation(s) sent successfully.`,
    });

    // Add to sent surveys
    const newSurveys: SentSurvey[] = emails.map((email, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      supplierName: email.split('@')[0].replace(/[._]/g, ' '),
      supplierEmail: email.trim(),
      template: selectedTemplate.name,
      status: 'sent' as const,
      sentAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + parseInt(dueInDays) * 86400000).toISOString().split('T')[0],
    }));

    setSentSurveys(prev => [...newSurveys, ...prev]);
    setIsCreating(false);
    setSelectedTemplate(null);
    setBulkEmails('');
    setCustomMessage('');
  };

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
            {score && (
              <Badge variant="outline" className="font-mono">
                Score: {score}/100
              </Badge>
            )}
          </div>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'viewed':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <FileText className="h-3 w-3 mr-1" />
            Viewed
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="secondary">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedCount = sentSurveys.filter(s => s.status === 'completed').length;
  const responseRate = sentSurveys.length > 0 
    ? Math.round((completedCount / sentSurveys.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Vendor Emission Surveys
          </h2>
          <p className="text-muted-foreground mt-1">
            Collect accurate Scope 3 data directly from your supply chain partners
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Send Vendor Survey</DialogTitle>
              <DialogDescription>
                Choose a template and send to your suppliers
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Template Selection */}
              <div className="space-y-3">
                <Label>Select Survey Template</Label>
                <div className="grid grid-cols-1 gap-2">
                  {SURVEY_TEMPLATES.map(template => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{template.questions} questions</p>
                          <p className="text-muted-foreground">{template.estimatedTime}</p>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <>
                  {/* Recipients */}
                  <div className="space-y-2">
                    <Label>Supplier Email Addresses</Label>
                    <Textarea
                      value={bulkEmails}
                      onChange={e => setBulkEmails(e.target.value)}
                      placeholder="Enter email addresses (one per line)&#10;supplier1@company.com&#10;supplier2@company.com"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter one email per line. You can also paste from a spreadsheet.
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Response Deadline</Label>
                      <Select value={dueInDays} onValueChange={setDueInDays}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="45">45 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reminders</Label>
                      <div className="flex items-center gap-2 h-10">
                        <Checkbox 
                          id="reminders" 
                          checked={sendReminders} 
                          onCheckedChange={(v) => setSendReminders(v as boolean)} 
                        />
                        <label htmlFor="reminders" className="text-sm cursor-pointer">
                          Send automatic reminders
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div className="space-y-2">
                    <Label>Custom Message (Optional)</Label>
                    <Textarea
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                      placeholder="Add a personalized message to your suppliers..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleSendSurvey}
                      disabled={!bulkEmails.trim()}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Survey Invitations
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Surveys Sent</p>
                <p className="text-2xl font-bold">{sentSurveys.length}</p>
              </div>
              <Send className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{responseRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">
                  {sentSurveys.filter(s => s.score).length > 0
                    ? Math.round(
                        sentSurveys.filter(s => s.score).reduce((sum, s) => sum + (s.score || 0), 0) /
                        sentSurveys.filter(s => s.score).length
                      )
                    : '—'}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Tracking</CardTitle>
          <CardDescription>Monitor the status of sent surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentSurveys.map(survey => (
              <div 
                key={survey.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{survey.supplierName}</p>
                    <p className="text-sm text-muted-foreground">{survey.supplierEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Template: {survey.template}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">Due: {survey.dueDate}</p>
                    {survey.completedAt && (
                      <p className="text-green-600">Completed: {survey.completedAt}</p>
                    )}
                  </div>
                  {getStatusBadge(survey.status, survey.score)}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Copy survey link">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="View response">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Survey Templates Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Survey Templates</CardTitle>
          <CardDescription>Pre-built templates aligned with GHG Protocol and CDP standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SURVEY_TEMPLATES.map(template => (
              <Card key={template.id} className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-muted text-foreground">
                      {template.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.questions} questions • {template.estimatedTime}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
