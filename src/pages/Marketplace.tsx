import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Wind, Droplets, Sun, MapPin, ShieldCheck, Leaf } from "lucide-react";

const carbonCredits = [
  {
    id: 1,
    title: "Amazon Rainforest Conservation",
    location: "Brazil",
    type: "Forest Conservation",
    icon: TreePine,
    price: 24.50,
    available: 5000,
    verified: true,
    description: "Protect endangered rainforest and preserve biodiversity in the Amazon basin.",
    impact: "1 credit = 1 ton CO₂ offset",
  },
  {
    id: 2,
    title: "Wind Farm Initiative",
    location: "Texas, USA",
    type: "Renewable Energy",
    icon: Wind,
    price: 18.75,
    available: 12000,
    verified: true,
    description: "Support clean energy generation through wind power infrastructure.",
    impact: "1 credit = 1 ton CO₂ offset",
  },
  {
    id: 3,
    title: "Ocean Cleanup Project",
    location: "Pacific Ocean",
    type: "Ocean Conservation",
    icon: Droplets,
    price: 32.00,
    available: 2500,
    verified: true,
    description: "Remove plastic waste and restore marine ecosystems worldwide.",
    impact: "1 credit = 1 ton CO₂ offset",
  },
  {
    id: 4,
    title: "Solar Energy Expansion",
    location: "Morocco",
    type: "Renewable Energy",
    icon: Sun,
    price: 21.25,
    available: 8000,
    verified: true,
    description: "Expand solar power capacity in developing regions.",
    impact: "1 credit = 1 ton CO₂ offset",
  },
];

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Carbon Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Purchase verified carbon credits to offset your emissions
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Your Offset Progress</h3>
                <p className="text-sm text-muted-foreground">
                  You've offset <span className="font-medium text-foreground">12,200 kg CO₂</span> this year.
                  Purchase <span className="font-medium text-foreground">16,250 kg</span> more to become carbon neutral.
                </p>
              </div>
              <Button>Calculate Needed Credits</Button>
            </div>
          </CardContent>
        </Card>

        {/* Credits Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {carbonCredits.map((credit) => (
            <Card key={credit.id} className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="rounded-xl bg-accent p-3">
                    <credit.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  {credit.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{credit.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {credit.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">{credit.description}</p>
                <Badge variant="outline">{credit.type}</Badge>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-display">${credit.price}</p>
                    <p className="text-xs text-muted-foreground">per ton CO₂</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{credit.available.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">credits available</p>
                  </div>
                </div>
                <Button className="w-full">Purchase Credits</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
