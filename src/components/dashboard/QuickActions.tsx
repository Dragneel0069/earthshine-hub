import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BadgeCheck, Calculator, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Plus,
    label: "Add Data",
    description: "Log emissions",
    variant: "default" as const,
    href: "#",
  },
  {
    icon: FileText,
    label: "Generate Report",
    description: "BRSR compliant",
    variant: "outline" as const,
    href: "/reports",
  },
  {
    icon: BadgeCheck,
    label: "View Credits",
    description: "Carbon marketplace",
    variant: "outline" as const,
    href: "/marketplace",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Button
              variant={action.variant}
              className="w-full justify-start gap-3 h-auto py-3"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
        
        <div className="border-t pt-3 mt-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
