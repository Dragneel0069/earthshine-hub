import { useState } from 'react';
import { FileText, Award, AlertCircle, Loader2, Download, ExternalLink, Clock, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { useMarketplaceOrders, OrderWithDetails } from '@/hooks/useMarketplaceOrders';
import type { Tables, Enums } from '@/integrations/supabase/types';

type RetirementProof = Tables<'retirement_proofs'>;
type OrderStatus = Enums<'order_status'>;

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  initiated: { label: 'Initiated', color: 'bg-blue-100 text-blue-800', icon: Clock },
  paid: { label: 'Paid', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  in_escrow: { label: 'In Escrow', color: 'bg-purple-100 text-purple-800', icon: Clock },
  retired: { label: 'Retired', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
};

function formatDate(dateString: string | null) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function OrderRow({ order }: { order: OrderWithDetails }) {
  const projectName = order.catalog?.project_name || 'Unknown Project';
  
  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
      <TableCell>
        <div className="max-w-[200px] truncate" title={projectName}>
          {projectName}
        </div>
      </TableCell>
      <TableCell className="text-right">{Number(order.quantity).toLocaleString()}</TableCell>
      <TableCell className="text-right">₹{Number(order.total_amount).toLocaleString()}</TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        {order.retirement_proof ? (
          <Button variant="ghost" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Certificate
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function CertificateCard({ cert }: { cert: RetirementProof }) {
  const catalogSnapshot = cert.catalog_snapshot as { project_name?: string; registry?: string } | null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{catalogSnapshot?.project_name || 'Carbon Credit Retirement'}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Certificate #{cert.certificate_number}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <Award className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium">{Number(cert.quantity).toLocaleString()} tCO₂e</p>
          </div>
          <div>
            <p className="text-muted-foreground">Registry</p>
            <p className="font-medium uppercase">{cert.registry}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Beneficiary</p>
            <p className="font-medium">{cert.beneficiary_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Retired</p>
            <p className="font-medium">{formatDate(cert.generated_at)}</p>
          </div>
        </div>
        
        {cert.verification_hash && (
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Verification Hash</p>
            <p className="text-xs font-mono truncate">{cert.verification_hash}</p>
          </div>
        )}

        <div className="flex gap-2">
          {cert.certificate_url && (
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
          {cert.registry_retirement_id && (
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <ExternalLink className="h-4 w-4" />
              Registry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyOrders() {
  const { user } = useAuth();
  const { hasOrganization } = useOrganization();
  const { orders, certificates, loading, error } = useMarketplaceOrders();

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

  if (!hasOrganization) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Organization Required</h3>
          <p className="text-muted-foreground">Complete your organization setup to view orders.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/dashboard'}>
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Orders</h3>
          <p className="text-muted-foreground">Fetching your order history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
          <p className="text-muted-foreground">{error.message}</p>
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
            {orders.length > 0 && (
              <Badge variant="secondary" className="ml-1">{orders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
            {certificates.length > 0 && (
              <Badge variant="secondary" className="ml-1">{certificates.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't purchased any carbon credits yet. Browse the marketplace to get started.
                </p>
                <Button onClick={() => window.location.href = '/marketplace'}>
                  Browse Credits
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Credits</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Certificate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
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
                  Retirement certificates will appear here once your credits are retired.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
