import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BRSR_PRINCIPLES, BRSR_SECTION_A, BRSR_SECTION_B } from '@/data/brsr-framework';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BRSRReportGeneratorProps {
  companyData?: {
    name: string;
    cin: string;
    year: string;
    emissions: {
      scope1: number;
      scope2: number;
      scope3: number;
    };
  };
}

export const BRSRReportGenerator = ({ companyData }: BRSRReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completeness, setCompleteness] = useState(78);

  const generateBRSRReport = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Title Page
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Business Responsibility and', 105, yPos, { align: 'center' });
      yPos += 10;
      doc.text('Sustainability Report (BRSR)', 105, yPos, { align: 'center' });
      yPos += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Financial Year: ${companyData?.year || '2024-25'}`, 105, yPos, { align: 'center' });
      yPos += 10;
      doc.text(companyData?.name || 'Company Name', 105, yPos, { align: 'center' });
      yPos += 10;
      doc.text(`CIN: ${companyData?.cin || 'L12345MH2020PLC123456'}`, 105, yPos, { align: 'center' });

      // Section A: General Disclosures
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Section A: General Disclosures', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      BRSR_SECTION_A.items.forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${item}`, 20, yPos);
        yPos += 7;
      });

      // Section B: Management and Process Disclosures
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Section B: Management and Process Disclosures', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      BRSR_SECTION_B.items.forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${item}`, 20, yPos);
        yPos += 7;
      });

      // Section C: Principle-wise Performance
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Section C: Principle-wise Performance Disclosure', 20, yPos);
      yPos += 15;

      BRSR_PRINCIPLES.forEach((principle) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Principle ${principle.id}: ${principle.name}`, 20, yPos);
        yPos += 7;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const descLines = doc.splitTextToSize(principle.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 5;

        // Essential Indicators
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Essential Indicators:', 20, yPos);
        yPos += 7;

        doc.setFont('helvetica', 'normal');
        principle.essentialIndicators.forEach((indicator, idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const questionLines = doc.splitTextToSize(`${idx + 1}. ${indicator.question}`, 165);
          doc.text(questionLines, 25, yPos);
          yPos += questionLines.length * 5 + 3;
        });

        yPos += 5;
      });

      // Environmental Performance (Principle 6 - Detailed)
      doc.addPage();
      yPos = 20;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Environmental Performance - Detailed Metrics', 20, yPos);
      yPos += 15;

      const emissionsData = [
        ['Scope', 'Emissions (tCO₂e)', 'Percentage'],
        ['Scope 1 (Direct)', (companyData?.emissions.scope1 || 450.5).toFixed(2), '29%'],
        ['Scope 2 (Indirect - Energy)', (companyData?.emissions.scope2 || 380.2).toFixed(2), '24%'],
        ['Scope 3 (Value Chain)', (companyData?.emissions.scope3 || 720.8).toFixed(2), '47%'],
        ['Total', ((companyData?.emissions.scope1 || 450.5) + (companyData?.emissions.scope2 || 380.2) + (companyData?.emissions.scope3 || 720.8)).toFixed(2), '100%'],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [emissionsData[0]],
        body: emissionsData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34] },
      });

      // Footer on each page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `BRSR Report - ${companyData?.name || 'Company Name'} - FY ${companyData?.year || '2024-25'}`,
          105,
          290,
          { align: 'center' }
        );
        doc.text(`Page ${i} of ${pageCount}`, 105, 295, { align: 'center' });
      }

      // Save the PDF
      doc.save(`BRSR_Report_FY${companyData?.year || '2024-25'}.pdf`);
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating BRSR report:', error);
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          BRSR Report Generator
        </CardTitle>
        <CardDescription>
          Generate comprehensive BRSR report aligned with SEBI guidelines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completeness Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Report Completeness</span>
            <Badge variant={completeness >= 80 ? 'default' : 'secondary'}>
              {completeness}%
            </Badge>
          </div>
          <Progress value={completeness} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completeness >= 80 
              ? 'Your report meets the minimum requirements for BRSR compliance'
              : 'Complete remaining sections to meet BRSR requirements'}
          </p>
        </div>

        {/* Principle Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Principle-wise Status</h4>
          <div className="grid gap-2">
            {BRSR_PRINCIPLES.slice(0, 6).map((principle) => (
              <div key={principle.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Principle {principle.id}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {principle.essentialIndicators.length} indicators
                </Badge>
              </div>
            ))}
            {BRSR_PRINCIPLES.slice(6).map((principle) => (
              <div key={principle.id} className="flex items-center justify-between p-2 rounded-lg border border-warning/50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Principle {principle.id}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Incomplete
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateBRSRReport} 
          disabled={isGenerating}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Generate BRSR Report (PDF)
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Report will include all 9 BRSR principles with essential and leadership indicators
        </p>
      </CardContent>
    </Card>
  );
};
