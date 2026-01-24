import { useState, useEffect } from 'react';
import { Download, ExternalLink, Calendar, Award, CheckCircle, Clock, FileText, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BlockchainVerification } from './BlockchainVerification';

interface Order {
  id: string;
  order_number: string;
  credits_purchased: number;
  total_amount: number;
  payment_status: string;
  escrow_status: string;
  retirement_status: string;
  created_at: string;
  certificate_id?: string;
}

interface Certificate {
  id: string;
  certificate_number: string;
  project_name: string;
  registry: string;
  vintage_year: number;
  credits_retired: number;
  retirement_date: string;
  beneficiary_name: string;
  pdf_url?: string;
}

export function MyOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchCertificates();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await (supabase
      .from('marketplace_orders') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const fetchCertificates = async () => {
    const { data, error } = await (supabase
      .from('retirement_certificates') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCertificates(data);
    }
  };

  const handleRequestRetirement = async (orderId: string) => {
    const { error } = await (supabase
      .from('marketplace_orders') as any)
      .update({
        retirement_status: 'requested',
        retirement_requested_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to request retirement' });
    } else {
      toast({ title: 'Retirement requested', description: 'Credits will be retired with the registry.' });
      fetchOrders();
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRetirementStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Retired</Badge>;
      case 'requested':
        return <Badge className="bg-blue-100 text-blue-700"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case 'none':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Please Log In</h3>
          <p className="text-muted-foreground">You need to be logged in to view your orders.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/login'}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Orders
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse the marketplace and purchase your first carbon credits.
                </p>
                <Button onClick={() => window.location.href = '/marketplace'}>
                  Browse Credits
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Retirement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{order.credits_purchased} tCO₂e</TableCell>
                      <TableCell>₹{order.total_amount.toLocaleString()}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                      <TableCell>{getRetirementStatusBadge(order.retirement_status)}</TableCell>
                      <TableCell>
                        {order.payment_status === 'completed' && order.retirement_status === 'none' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestRetirement(order.id)}
                          >
                            Request Retirement
                          </Button>
                        )}
                        {order.retirement_status === 'confirmed' && order.certificate_id && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground">
                  Certificates are issued after credits are retired with the registry.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cert.project_name}</CardTitle>
                        <CardDescription>{cert.certificate_number}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Registry</p>
                        <p className="font-medium">{cert.registry.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vintage</p>
                        <p className="font-medium">{cert.vintage_year}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Credits Retired</p>
                        <p className="font-medium">{cert.credits_retired} tCO₂e</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Retirement Date</p>
                        <p className="font-medium">
                          {new Date(cert.retirement_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-sm">Retired on behalf of</p>
                      <p className="font-medium">{cert.beneficiary_name}</p>
                    </div>

                    {/* Blockchain Verification */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" size="sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Blockchain Verification
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Certificate Verification</DialogTitle>
                        </DialogHeader>
                        <BlockchainVerification
                          certificateNumber={cert.certificate_number}
                          creditsRetired={cert.credits_retired}
                          retirementDate={cert.retirement_date}
                          projectName={cert.project_name}
                          registry={cert.registry}
                          beneficiaryName={cert.beneficiary_name}
                        />
                      </DialogContent>
                    </Dialog>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
