import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle, X, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getEmissionFactor } from '@/data/india-emission-factors';

interface ParsedRow {
  date: string;
  category: string;
  quantity: number;
  unit: string;
  source?: string;
  scope?: number;
  co2e?: number;
  isValid: boolean;
  errors: string[];
}

interface ColumnMapping {
  date: string;
  category: string;
  quantity: string;
  unit: string;
  source?: string;
}

const IMPORT_TYPES = [
  { value: 'energy', label: 'Energy Consumption', categories: ['Electricity', 'Natural Gas', 'LPG', 'Coal'] },
  { value: 'transport', label: 'Transport & Fleet', categories: ['Petrol', 'Diesel', 'CNG', 'Air Travel', 'Rail'] },
  { value: 'fuel', label: 'Fuel Combustion', categories: ['Diesel Generator', 'Furnace Oil', 'Biomass'] },
  { value: 'waste', label: 'Waste Management', categories: ['Landfill', 'Incineration', 'Recycling'] },
];

const SAMPLE_CSV = `date,category,quantity,unit,source
2024-01-15,Electricity,5000,kWh,Grid Power
2024-01-15,Diesel,200,liters,Fleet Vehicles
2024-01-20,Natural Gas,150,m3,Heating
2024-02-01,Electricity,4800,kWh,Grid Power`;

export function CSVImporter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [importType, setImportType] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<string[][]>([]);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    date: '',
    category: '',
    quantity: '',
    unit: '',
  });
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'complete'>('upload');
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);

  const parseCSV = (text: string): { headers: string[]; data: string[][] } => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
    
    return { headers, data };
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
      });
      return;
    }

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const { headers, data } = parseCSV(text);
      setHeaders(headers);
      setRawData(data);
      
      // Auto-detect column mapping
      const autoMapping: ColumnMapping = { date: '', category: '', quantity: '', unit: '' };
      headers.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes('date')) autoMapping.date = h;
        if (lower.includes('category') || lower.includes('type')) autoMapping.category = h;
        if (lower.includes('quantity') || lower.includes('amount') || lower.includes('value')) autoMapping.quantity = h;
        if (lower.includes('unit')) autoMapping.unit = h;
        if (lower.includes('source') || lower.includes('description')) autoMapping.source = h;
      });
      setColumnMapping(autoMapping);
      setStep('mapping');
    };
    reader.readAsText(uploadedFile);
  }, [toast]);

  const validateAndParseData = useCallback(() => {
    const parsed: ParsedRow[] = rawData.map(row => {
      const errors: string[] = [];
      const dateIdx = headers.indexOf(columnMapping.date);
      const categoryIdx = headers.indexOf(columnMapping.category);
      const quantityIdx = headers.indexOf(columnMapping.quantity);
      const unitIdx = headers.indexOf(columnMapping.unit);
      const sourceIdx = columnMapping.source ? headers.indexOf(columnMapping.source) : -1;

      const date = row[dateIdx] || '';
      const category = row[categoryIdx] || '';
      const quantityStr = row[quantityIdx] || '';
      const unit = row[unitIdx] || '';
      const source = sourceIdx >= 0 ? row[sourceIdx] : '';

      // Validate date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push('Invalid date format');
      }

      // Validate quantity
      const quantity = parseFloat(quantityStr);
      if (isNaN(quantity) || quantity <= 0) {
        errors.push('Invalid quantity');
      }

      // Determine scope and calculate emissions
      let scope = 1;
      let emissionFactor = 0;
      
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes('electric')) {
        scope = 2;
        emissionFactor = getEmissionFactor('electricity', 'all_india');
      } else if (categoryLower.includes('diesel') || categoryLower.includes('petrol')) {
        scope = 1;
        emissionFactor = getEmissionFactor('fuel', categoryLower.includes('diesel') ? 'diesel' : 'petrol');
      } else if (categoryLower.includes('natural gas')) {
        scope = 1;
        emissionFactor = getEmissionFactor('fuel', 'natural_gas');
      } else if (categoryLower.includes('travel') || categoryLower.includes('flight')) {
        scope = 3;
        emissionFactor = 0.255; // Average flight emission factor
      } else {
        emissionFactor = 2.5; // Default fallback
      }

      const co2e = quantity * emissionFactor;

      return {
        date,
        category,
        quantity,
        unit,
        source,
        scope,
        co2e,
        isValid: errors.length === 0,
        errors,
      };
    });

    setParsedData(parsed);
    setStep('preview');
  }, [rawData, headers, columnMapping]);

  const handleImport = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to import data' });
      return;
    }

    setStep('importing');
    const validRows = parsedData.filter(row => row.isValid);
    let successCount = 0;
    let errorCount = 0;

    // Create import record
    const { data: importRecord, error: importError } = await (supabase
      .from('csv_imports') as any)
      .insert({
        user_id: user.id,
        file_name: file?.name || 'unknown.csv',
        import_type: importType,
        row_count: parsedData.length,
        status: 'processing',
      })
      .select()
      .single();

    if (importError) {
      toast({ variant: 'destructive', title: 'Failed to create import record' });
      return;
    }

    // Import each row
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      
      const { error } = await supabase.from('emissions').insert({
        user_id: user.id,
        date: row.date,
        category: row.category,
        scope: row.scope || 1,
        quantity: row.quantity,
        unit: row.unit,
        emission_factor: row.co2e ? row.co2e / row.quantity : null,
        co2e: row.co2e || 0,
      });

      if (error) {
        errorCount++;
      } else {
        successCount++;
      }

      setImportProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    // Update import record
    await (supabase
      .from('csv_imports') as any)
      .update({
        success_count: successCount,
        error_count: errorCount,
        status: errorCount === 0 ? 'completed' : 'completed_with_errors',
      })
      .eq('id', importRecord.id);

    setImportResult({ success: successCount, errors: errorCount });
    setStep('complete');

    toast({
      title: 'Import Complete',
      description: `Successfully imported ${successCount} records${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emissions_template.csv';
    a.click();
  };

  const resetImporter = () => {
    setFile(null);
    setHeaders([]);
    setRawData([]);
    setParsedData([]);
    setColumnMapping({ date: '', category: '', quantity: '', unit: '' });
    setStep('upload');
    setImportProgress(0);
    setImportResult(null);
  };

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
      <CardContent className="space-y-6">
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="text-sm font-medium">Import Type</label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {IMPORT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports: CSV files up to 10MB
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {step === 'mapping' && (
          <div className="space-y-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                Loaded {rawData.length} rows from {file?.name}. Map your columns below.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              {['date', 'category', 'quantity', 'unit'].map(field => (
                <div key={field}>
                  <label className="text-sm font-medium capitalize">{field} Column *</label>
                  <Select
                    value={columnMapping[field as keyof ColumnMapping] || ''}
                    onValueChange={val => setColumnMapping(prev => ({ ...prev, [field]: val }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={`Select ${field} column`} />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetImporter}>
                Cancel
              </Button>
              <Button
                onClick={validateAndParseData}
                disabled={!columnMapping.date || !columnMapping.category || !columnMapping.quantity || !columnMapping.unit}
              >
                Validate & Preview
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Check className="h-3 w-3 mr-1" />
                  {parsedData.filter(r => r.isValid).length} Valid
                </Badge>
                {parsedData.filter(r => !r.isValid).length > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {parsedData.filter(r => !r.isValid).length} Errors
                  </Badge>
                )}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>CO₂e (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 50).map((row, idx) => (
                    <TableRow key={idx} className={row.isValid ? '' : 'bg-red-50'}>
                      <TableCell>
                        {row.isValid ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.quantity.toLocaleString()}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Scope {row.scope}</Badge>
                      </TableCell>
                      <TableCell>{row.co2e?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={parsedData.filter(r => r.isValid).length === 0}>
                Import {parsedData.filter(r => r.isValid).length} Records
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Importing */}
        {step === 'importing' && (
          <div className="space-y-4 text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Importing data...</p>
            <Progress value={importProgress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 'complete' && importResult && (
          <div className="space-y-4 text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xl font-semibold">Import Complete!</p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                <p className="text-sm text-muted-foreground">Imported</p>
              </div>
              {importResult.errors > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.errors}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              )}
            </div>
            <Button onClick={resetImporter}>Import More Data</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
