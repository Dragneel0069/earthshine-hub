import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CSVImporter() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          CSV Data Import
        </CardTitle>
        <CardDescription>
          Upload your emissions data from spreadsheets for bulk import
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <Construction className="h-4 w-4" />
          <AlertTitle>Architecture Upgrade in Progress</AlertTitle>
          <AlertDescription>
            The CSV importer is being upgraded to support the new organization-centric 
            data model with approval workflows. This feature will be available once 
            Phase 3 of the backend migration is complete.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Coming Soon</p>
          <p className="text-sm mt-1">
            Bulk import with validation, approval workflow, and audit logging
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
