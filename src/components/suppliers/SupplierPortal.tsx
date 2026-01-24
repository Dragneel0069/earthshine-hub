import { useState, useEffect } from 'react';
import { Plus, Send, Building2, Mail, TrendingUp, Clock, CheckCircle, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
  email: string;
  category: string;
  annual_spend: number;
  status: string;
  emissions_data: Record<string, number>;
  last_updated: string | null;
  created_at: string;
}

interface SupplierRequest {
  id: string;
  supplier_id: string;
  request_type: string;
  status: string;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

const SUPPLIER_CATEGORIES = [
  { value: 'raw_materials', label: 'Raw Materials', factor: 0.5 },
  { value: 'packaging', label: 'Packaging', factor: 0.3 },
  { value: 'logistics', label: 'Logistics & Transport', factor: 0.8 },
  { value: 'manufacturing', label: 'Contract Manufacturing', factor: 0.6 },
  { value: 'it_services', label: 'IT Services', factor: 0.1 },
  { value: 'professional_services', label: 'Professional Services', factor: 0.05 },
  { value: 'utilities', label: 'Utilities', factor: 0.7 },
  { value: 'other', label: 'Other', factor: 0.2 },
];

const REQUEST_TYPES = [
  { value: 'emissions_data', label: 'Emissions Data Request', description: 'Request Scope 1, 2, 3 emissions data' },
  { value: 'certification', label: 'Certification Verification', description: 'Verify environmental certifications' },
  { value: 'survey', label: 'Sustainability Survey', description: 'Complete sustainability assessment' },
];

export function SupplierPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    category: '',
    annual_spend: '',
  });

  const [newRequest, setNewRequest] = useState({
    request_type: '',
    due_days: '30',
  });

  useEffect(() => {
    if (user) {
      fetchSuppliers();
      fetchRequests();
    }
  }, [user]);

  const fetchSuppliers = async () => {
    if (!user) return;
    
    const { data, error } = await (supabase
      .from('suppliers') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers((data || []) as Supplier[]);
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    if (!user) return;
    
    const { data, error } = await (supabase
      .from('supplier_requests') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests((data || []) as SupplierRequest[]);
    }
  };

  const handleAddSupplier = async () => {
    if (!user) return;
    
    const { error } = await (supabase.from('suppliers') as any).insert({
      user_id: user.id,
      name: newSupplier.name,
      email: newSupplier.email,
      category: newSupplier.category,
      annual_spend: parseFloat(newSupplier.annual_spend) || 0,
      status: 'pending',
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to add supplier' });
    } else {
      toast({ title: 'Supplier added successfully' });
      setNewSupplier({ name: '', email: '', category: '', annual_spend: '' });
      setIsAddingSupplier(false);
      fetchSuppliers();
    }
  };

  const handleSendRequest = async () => {
    if (!user || !selectedSupplier) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(newRequest.due_days));

    const { error } = await (supabase.from('supplier_requests') as any).insert({
      user_id: user.id,
      supplier_id: selectedSupplier.id,
      request_type: newRequest.request_type,
      status: 'sent',
      due_date: dueDate.toISOString(),
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to send request' });
    } else {
      toast({ title: 'Request sent to supplier' });
      setNewRequest({ request_type: '', due_days: '30' });
      setIsSendingRequest(false);
      setSelectedSupplier(null);
      fetchRequests();
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    const { error } = await (supabase.from('suppliers') as any).delete().eq('id', id);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to delete supplier' });
    } else {
      toast({ title: 'Supplier removed' });
      fetchSuppliers();
    }
  };

  const calculateEstimatedEmissions = (supplier: Supplier) => {
    const categoryData = SUPPLIER_CATEGORIES.find(c => c.value === supplier.category);
    const factor = categoryData?.factor || 0.2;
    return (supplier.annual_spend * factor / 1000).toFixed(1); // tCO₂e
  };

  const getTotalScope3 = () => {
    return suppliers.reduce((total, supplier) => {
      const categoryData = SUPPLIER_CATEGORIES.find(c => c.value === supplier.category);
      const factor = categoryData?.factor || 0.2;
      return total + (supplier.annual_spend * factor / 1000);
    }, 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800"><Send className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'viewed':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Viewed</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Please log in to access the Supplier Portal</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Scope 3</p>
                <p className="text-2xl font-bold">{getTotalScope3().toFixed(1)} tCO₂e</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'sent').length}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">
                  {requests.length > 0 
                    ? Math.round((requests.filter(r => r.status === 'completed').length / requests.length) * 100) 
                    : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suppliers">
        <TabsList>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Supply Chain Partners</h3>
              <p className="text-sm text-muted-foreground">Manage your Scope 3 emissions sources</p>
            </div>
            <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Add a supplier to track their emissions contribution
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={newSupplier.name}
                      onChange={e => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={newSupplier.email}
                      onChange={e => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="supplier@company.com"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newSupplier.category}
                      onValueChange={val => setNewSupplier(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPLIER_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Annual Spend (₹)</Label>
                    <Input
                      type="number"
                      value={newSupplier.annual_spend}
                      onChange={e => setNewSupplier(prev => ({ ...prev, annual_spend: e.target.value }))}
                      placeholder="Enter annual spend"
                    />
                  </div>
                  <Button onClick={handleAddSupplier} className="w-full" disabled={!newSupplier.name || !newSupplier.category}>
                    Add Supplier
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Annual Spend</TableHead>
                  <TableHead>Est. Emissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No suppliers added yet. Click "Add Supplier" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{supplier.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {SUPPLIER_CATEGORIES.find(c => c.value === supplier.category)?.label || supplier.category}
                      </TableCell>
                      <TableCell>₹{supplier.annual_spend.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-medium">{calculateEstimatedEmissions(supplier)} tCO₂e</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'outline'}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setIsSendingRequest(true);
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Data Collection Requests</h3>
            <p className="text-sm text-muted-foreground">Track emissions data requests sent to suppliers</p>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No requests sent yet. Select a supplier and send a data request.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map(request => {
                    const supplier = suppliers.find(s => s.id === request.supplier_id);
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{supplier?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          {REQUEST_TYPES.find(t => t.value === request.request_type)?.label || request.request_type}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.due_date ? new Date(request.due_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Request Dialog */}
      <Dialog open={isSendingRequest} onOpenChange={setIsSendingRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Data Request</DialogTitle>
            <DialogDescription>
              Request emissions data from {selectedSupplier?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Request Type</Label>
              <Select
                value={newRequest.request_type}
                onValueChange={val => setNewRequest(prev => ({ ...prev, request_type: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <p>{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due in (days)</Label>
              <Select
                value={newRequest.due_days}
                onValueChange={val => setNewRequest(prev => ({ ...prev, due_days: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendRequest} className="w-full" disabled={!newRequest.request_type}>
              <Mail className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
