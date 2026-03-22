import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/shared/SEO';
import { CSVImporter } from '@/components/data-import/CSVImporter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, Database, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ImportHistory {
  id: string;
  file_name: string;
  import_type: string;
  row_count: number;
  success_count: number;
  error_count: number;
  status: string;
  created_at: string;
}

export default function DataImport() {
  const { user } = useAuth();
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);

  useEffect(() => {
    if (user) {
      fetchImportHistory();
    }
  }, [user]);

  const fetchImportHistory = async () => {
    // CSV imports table removed in Phase 1 migration
    // Will be re-implemented in Phase 3 with org-scoped imports
    setImportHistory([]);
  };

  return (
    <>
      <SEO 
        title="Data Import | Zero Graph" 
        description="Import your emissions data via CSV for bulk processing" 
      />
      <Navbar />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Data Import</h1>
            <p className="text-muted-foreground">
              Import your emissions data from spreadsheets, accounting systems, or utility bills
            </p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Upload CSV
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Import History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CSVImporter />
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Supported Data Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { icon: '⚡', title: 'Energy', desc: 'Electricity, gas, fuel consumption' },
                        { icon: '🚗', title: 'Transport', desc: 'Fleet, travel, logistics' },
                        { icon: '🏭', title: 'Fuel', desc: 'Combustion, generators' },
                        { icon: '♻️', title: 'Waste', desc: 'Disposal, recycling data' },
                      ].map(item => (
                        <div key={item.title} className="flex items-start gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Date column (YYYY-MM-DD format)
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Category/Activity type
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Quantity value
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Unit of measurement
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Imports</CardTitle>
                  <CardDescription>View your import history and status</CardDescription>
                </CardHeader>
                <CardContent>
                  {importHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No imports yet. Upload your first CSV file to get started.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Rows</TableHead>
                          <TableHead>Success</TableHead>
                          <TableHead>Errors</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importHistory.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.file_name}</TableCell>
                            <TableCell>{item.import_type}</TableCell>
                            <TableCell>{item.row_count}</TableCell>
                            <TableCell className="text-green-600">{item.success_count}</TableCell>
                            <TableCell className="text-red-600">{item.error_count}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
  );
}
