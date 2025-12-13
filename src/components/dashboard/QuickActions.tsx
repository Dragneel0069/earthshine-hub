import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BadgeCheck, Calculator, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { EmissionsInputForm } from "./EmissionsInputForm";
import { CarbonCalculator } from "./CarbonCalculator";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Data - Opens Form Sheet */}
        <EmissionsInputForm
          trigger={
            <Button variant="default" className="w-full justify-start gap-3 h-auto py-3">
              <div className="rounded-lg bg-primary-foreground/20 p-2">
                <Plus className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium">Add Data</p>
                <p className="text-xs opacity-80">Log emissions</p>
              </div>
            </Button>
          }
        />

        {/* Generate Report */}
        <Link to="/reports">
          <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Generate Report</p>
              <p className="text-xs text-muted-foreground">BRSR compliant</p>
            </div>
          </Button>
        </Link>

        {/* View Credits */}
        <Link to="/marketplace">
          <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">View Credits</p>
              <p className="text-xs text-muted-foreground">Carbon marketplace</p>
            </div>
          </Button>
        </Link>

        <div className="border-t pt-3 mt-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <CarbonCalculator
              trigger={
                <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Calculator className="h-4 w-4" />
                  <Calculator className="h-4 w-4" />
                  Calculator
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
