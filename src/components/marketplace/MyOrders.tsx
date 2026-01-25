import { useState } from 'react';
import { FileText, Award, AlertCircle, Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function MyOrders() {
  const { user } = useAuth();

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
      <Alert>
        <Construction className="h-4 w-4" />
        <AlertTitle>Marketplace Upgrade in Progress</AlertTitle>
        <AlertDescription>
          The order management system is being upgraded to support organization-scoped 
          purchases with enhanced escrow and retirement workflows. This will be available 
          after Phase 3 & 4 of the backend migration.
        </AlertDescription>
      </Alert>

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
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Orders Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Organization-scoped credit orders with approval workflows will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Certificates Coming Soon</h3>
              <p className="text-muted-foreground">
                Retirement certificates with blockchain verification will be available after marketplace upgrade.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
