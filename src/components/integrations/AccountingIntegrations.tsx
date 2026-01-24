import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Link2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Building2,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: 'accounting' | 'erp' | 'utility';
  status: 'available' | 'connected' | 'coming_soon';
  features: string[];
  syncFrequency?: string;
  lastSync?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'tally',
    name: 'Tally Prime',
    description: 'India\'s leading business management software. Auto-sync expense data for Scope 3 calculations.',
    logo: '📊',
    category: 'accounting',
    status: 'available',
    features: ['Expense auto-import', 'Vendor categorization', 'Invoice tracking', 'GST data sync'],
  },
  {
    id: 'zoho_books',
    name: 'Zoho Books',
    description: 'Cloud accounting for Indian SMEs. Import financial data directly.',
    logo: '📗',
    category: 'accounting',
    status: 'available',
    features: ['Expense categories', 'Vendor management', 'Bank reconciliation', 'GST reports'],
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Global accounting software. Sync expenses and vendor payments.',
    logo: '💼',
    category: 'accounting',
    status: 'available',
    features: ['Expense tracking', 'Invoice sync', 'Multi-currency', 'Class tracking'],
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Cloud-based accounting. Connect bank feeds and expenses.',
    logo: '🔵',
    category: 'accounting',
    status: 'coming_soon',
    features: ['Bank feeds', 'Expense claims', 'Reporting', 'Payroll sync'],
  },
  {
    id: 'sap',
    name: 'SAP Business One',
    description: 'Enterprise ERP integration for large organizations.',
    logo: '🏢',
    category: 'erp',
    status: 'coming_soon',
    features: ['Financial modules', 'Procurement data', 'Inventory tracking', 'Custom fields'],
  },
  {
    id: 'oracle',
    name: 'Oracle NetSuite',
    description: 'Enterprise cloud ERP for multi-entity carbon tracking.',
    logo: '☁️',
    category: 'erp',
    status: 'coming_soon',
    features: ['Financial management', 'Supply chain', 'Multi-subsidiary', 'Custom reporting'],
  },
];

const SYNC_OPTIONS = [
  { value: 'realtime', label: 'Real-time', description: 'Sync immediately when data changes' },
  { value: 'hourly', label: 'Hourly', description: 'Sync every hour' },
  { value: 'daily', label: 'Daily', description: 'Sync once per day at midnight' },
  { value: 'weekly', label: 'Weekly', description: 'Sync every Monday at 6 AM' },
];

interface AccountingIntegrationsProps {
  compact?: boolean;
}

export function AccountingIntegrations({ compact = false }: AccountingIntegrationsProps) {
  const { toast } = useToast();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('daily');

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'coming_soon') {
      toast({
        title: 'Coming Soon',
        description: `${integration.name} integration will be available soon. We'll notify you when it's ready.`,
      });
      return;
    }
    setSelectedIntegration(integration);
    setIsConfiguring(true);
  };

  const handleConfirmConnect = () => {
    if (!selectedIntegration) return;
    
    // Simulate OAuth flow
    toast({
      title: 'Connecting...',
      description: `Redirecting to ${selectedIntegration.name} for authorization...`,
    });

    // Simulate successful connection
    setTimeout(() => {
      setConnectedIntegrations(prev => [...prev, selectedIntegration.id]);
      toast({
        title: 'Connected!',
        description: `${selectedIntegration.name} has been connected successfully. Initial sync starting...`,
      });
      setIsConfiguring(false);
      setSelectedIntegration(null);
    }, 2000);
  };

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(prev => prev.filter(id => id !== integrationId));
    toast({
      title: 'Disconnected',
      description: 'Integration has been disconnected.',
    });
  };

  const getStatusBadge = (status: string, integrationId: string) => {
    if (connectedIntegrations.includes(integrationId)) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      );
    }
    switch (status) {
      case 'available':
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Zap className="h-3 w-3 mr-1" />
            Available
          </Badge>
        );
      case 'coming_soon':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            Accounting Integrations
          </CardTitle>
          <CardDescription>Connect your accounting software for automated data sync</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INTEGRATIONS.slice(0, 4).map(integration => (
              <Button
                key={integration.id}
                variant={connectedIntegrations.includes(integration.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleConnect(integration)}
                disabled={integration.status === 'coming_soon'}
                className="gap-2"
              >
                <span>{integration.logo}</span>
                {integration.name}
                {connectedIntegrations.includes(integration.id) && (
                  <CheckCircle className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            Accounting Integrations
          </h2>
          <p className="text-muted-foreground mt-1">
            Connect your accounting software to auto-import financial data for accurate Scope 3 calculations
          </p>
        </div>
        {connectedIntegrations.length > 0 && (
          <Badge variant="outline" className="text-lg px-4 py-2">
            {connectedIntegrations.length} Connected
          </Badge>
        )}
      </div>

      {/* Benefits Banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">90%</div>
              <div className="text-sm text-muted-foreground">Less Manual Entry</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">Data Sync</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Auto</div>
              <div className="text-sm text-muted-foreground">Categorization</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">BRSR</div>
              <div className="text-sm text-muted-foreground">Ready Reports</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATIONS.map(integration => {
          const isConnected = connectedIntegrations.includes(integration.id);
          
          return (
            <Card 
              key={integration.id}
              className={`transition-all ${
                isConnected ? 'border-primary/50 shadow-glow' : 
                integration.status === 'coming_soon' ? 'opacity-70' : 'hover:border-primary/30'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 capitalize text-xs">
                        {integration.category === 'erp' ? 'ERP' : integration.category}
                      </Badge>
                    </div>
                  </div>
                  {getStatusBadge(integration.status, integration.id)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">FEATURES</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{integration.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last sync:</span>
                      <span className="font-medium">2 minutes ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync Now
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full"
                    variant={integration.status === 'coming_soon' ? 'secondary' : 'default'}
                    onClick={() => handleConnect(integration)}
                    disabled={integration.status === 'coming_soon'}
                  >
                    {integration.status === 'coming_soon' ? (
                      'Notify Me'
                    ) : (
                      <>
                        Connect
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIntegration?.logo}</span>
              Connect {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Configure how Zero Graph syncs with your accounting data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-sync enabled</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically import new transactions
                </p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            {autoSync && (
              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SYNC_OPTIONS.map(option => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all p-3 ${
                        syncFrequency === option.value 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSyncFrequency(option.value)}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Data to Import</Label>
              <div className="space-y-2">
                {['Expenses & Purchases', 'Vendor Payments', 'Fuel & Utility Bills', 'Travel Expenses'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsConfiguring(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmConnect}>
                Connect & Authorize
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
