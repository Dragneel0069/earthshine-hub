import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TreePine,
  Wind,
  Zap,
  Sun,
  MapPin,
  ShieldCheck,
  Search,
  Grid3X3,
  List,
  Star,
  Filter,
  X,
  IndianRupee,
  Leaf,
  Droplets,
  ShoppingCart,
} from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

// Indian states
const indianStates = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const projectTypes = [
  { id: "renewable", label: "Renewable Energy", icon: Sun },
  { id: "afforestation", label: "Afforestation", icon: TreePine },
  { id: "efficiency", label: "Energy Efficiency", icon: Zap },
  { id: "wind", label: "Wind Energy", icon: Wind },
  { id: "water", label: "Water Conservation", icon: Droplets },
];

const verificationStandards = [
  { id: "verra", label: "VERRA (VCS)" },
  { id: "gold", label: "Gold Standard" },
  { id: "indian", label: "Indian Carbon Registry" },
  { id: "cdm", label: "CDM (UN)" },
];

const getProjectIcon = (type: string) => {
  switch (type) {
    case "renewable":
      return Sun;
    case "afforestation":
      return TreePine;
    case "efficiency":
      return Zap;
    case "wind":
      return Wind;
    case "water":
      return Droplets;
    default:
      return Leaf;
  }
};

// Sample Indian carbon credits data
const carbonCredits = [
  {
    id: 1,
    projectName: "Rewa Solar Park",
    city: "Rewa",
    state: "Madhya Pradesh",
    type: "renewable",
    totalCredits: 125000,
    availableCredits: 48000,
    pricePerCredit: 1250,
    verification: "verra",
    sellerRating: 4.8,
    description: "One of India's largest solar parks generating 750MW clean energy.",
  },
  {
    id: 2,
    projectName: "Western Ghats Reforestation",
    city: "Coorg",
    state: "Karnataka",
    type: "afforestation",
    totalCredits: 85000,
    availableCredits: 32000,
    pricePerCredit: 1850,
    verification: "gold",
    sellerRating: 4.9,
    description: "Native species plantation in biodiversity hotspot region.",
  },
  {
    id: 3,
    projectName: "Muppandal Wind Farm",
    city: "Kanyakumari",
    state: "Tamil Nadu",
    type: "wind",
    totalCredits: 200000,
    availableCredits: 78000,
    pricePerCredit: 980,
    verification: "indian",
    sellerRating: 4.6,
    description: "Asia's largest wind farm cluster with 1500MW capacity.",
  },
  {
    id: 4,
    projectName: "Tata Steel Energy Efficiency",
    city: "Jamshedpur",
    state: "Jharkhand",
    type: "efficiency",
    totalCredits: 65000,
    availableCredits: 28000,
    pricePerCredit: 2200,
    verification: "verra",
    sellerRating: 4.7,
    description: "Industrial energy efficiency program reducing steel production emissions.",
  },
  {
    id: 5,
    projectName: "Sundarbans Mangrove Conservation",
    city: "South 24 Parganas",
    state: "West Bengal",
    type: "afforestation",
    totalCredits: 45000,
    availableCredits: 18000,
    pricePerCredit: 2450,
    verification: "gold",
    sellerRating: 4.9,
    description: "Protecting world's largest mangrove forest and Bengal tiger habitat.",
  },
  {
    id: 6,
    projectName: "Gujarat Solar Initiative",
    city: "Charanka",
    state: "Gujarat",
    type: "renewable",
    totalCredits: 150000,
    availableCredits: 62000,
    pricePerCredit: 1100,
    verification: "cdm",
    sellerRating: 4.5,
    description: "Multi-technology solar park with 700MW installed capacity.",
  },
  {
    id: 7,
    projectName: "Rajasthan Desert Afforestation",
    city: "Jodhpur",
    state: "Rajasthan",
    type: "afforestation",
    totalCredits: 55000,
    availableCredits: 24000,
    pricePerCredit: 1650,
    verification: "indian",
    sellerRating: 4.4,
    description: "Desert greening project using native drought-resistant species.",
  },
  {
    id: 8,
    projectName: "Maharashtra Industrial Efficiency",
    city: "Pune",
    state: "Maharashtra",
    type: "efficiency",
    totalCredits: 40000,
    availableCredits: 15000,
    pricePerCredit: 1950,
    verification: "verra",
    sellerRating: 4.6,
    description: "Multi-sector industrial energy optimization program.",
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedVerifications, setSelectedVerifications] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);

  const filteredCredits = useMemo(() => {
    let result = [...carbonCredits];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.projectName.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.state.toLowerCase().includes(query)
      );
    }

    if (selectedState !== "All States") {
      result = result.filter((c) => c.state === selectedState);
    }

    if (selectedTypes.length > 0) {
      result = result.filter((c) => selectedTypes.includes(c.type));
    }

    if (selectedVerifications.length > 0) {
      result = result.filter((c) => selectedVerifications.includes(c.verification));
    }

    result = result.filter(
      (c) => c.pricePerCredit >= priceRange[0] && c.pricePerCredit <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
        break;
      case "price-high":
        result.sort((a, b) => b.pricePerCredit - a.pricePerCredit);
        break;
      case "rating":
        result.sort((a, b) => b.sellerRating - a.sellerRating);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [searchQuery, selectedState, selectedTypes, selectedVerifications, priceRange, sortBy]);

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const toggleVerification = (verId: string) => {
    setSelectedVerifications((prev) =>
      prev.includes(verId) ? prev.filter((v) => v !== verId) : [...prev, verId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("All States");
    setSelectedTypes([]);
    setSelectedVerifications([]);
    setPriceRange([500, 5000]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedState !== "All States" ||
    selectedTypes.length > 0 ||
    selectedVerifications.length > 0 ||
    priceRange[0] !== 500 ||
    priceRange[1] !== 5000;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        
        {/* Hero Banner */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Carbon Credit Marketplace</span>
              </motion.div>
              <motion.h1 
                className="text-3xl lg:text-5xl font-bold font-display mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-foreground">Verified Indian </span>
                <span className="bg-gradient-to-r from-primary via-secondary to-lime bg-clip-text text-transparent">
                  Carbon Credits
                </span>
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Support India's Path to Net Zero with verified offset projects
              </motion.p>
            </div>
          </div>
        </section>

        <div className="flex">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-72 border-r border-primary/10 bg-card/50 backdrop-blur-sm p-6 min-h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Filter className="h-4 w-4 text-primary" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Project Type */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block text-foreground">Project Type</Label>
                <div className="space-y-2">
                  {projectTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => toggleType(type.id)}
                        className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={type.id}
                        className="text-sm flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <type.icon className="h-3.5 w-3.5 text-primary" />
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* State */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block text-foreground">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="glass border-primary/20 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-primary/20 max-h-[250px] z-50">
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state} className="focus:bg-primary/20">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Verification */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block text-foreground">Verification Standard</Label>
                <div className="space-y-2">
                  {verificationStandards.map((ver) => (
                    <div key={ver.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={ver.id}
                        checked={selectedVerifications.includes(ver.id)}
                        onCheckedChange={() => toggleVerification(ver.id)}
                        className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={ver.id} className="text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        {ver.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block text-foreground">
                  Price Range (₹/credit)
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={500}
                  max={5000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                  <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by project name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-primary/20 focus:border-primary"
                />
              </div>

              {/* Sort & View */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-primary/20 hover:bg-primary/10"
                >
                  <Filter className="h-4 w-4" />
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] glass border-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-primary/20 z-50">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-primary/20 rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-none ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`rounded-none ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing <span className="text-primary font-medium">{filteredCredits.length}</span> of {carbonCredits.length} projects
            </p>

            {/* Credits Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filteredCredits.map((credit, index) => {
                const IconComponent = getProjectIcon(credit.type);
                const verLabel = verificationStandards.find(
                  (v) => v.id === credit.verification
                )?.label;

                if (viewMode === "list") {
                  return (
                    <motion.div
                      key={credit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="flex flex-col sm:flex-row items-stretch glass-strong border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all">
                        <div className="p-4 sm:p-5 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/5 sm:w-28">
                          <div className="rounded-xl bg-card/80 p-3">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{credit.projectName}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {credit.city}, {credit.state}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="gap-1 bg-primary/20 text-primary border-0">
                                <ShieldCheck className="h-3 w-3" />
                                {verLabel}
                              </Badge>
                              <Badge variant="outline" className="gap-1 border-secondary/30 text-secondary">
                                <Star className="h-3 w-3 fill-secondary" />
                                {credit.sellerRating}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{credit.description}</p>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Available:{" "}
                                <span className="text-foreground font-medium">
                                  {credit.availableCredits.toLocaleString("en-IN")}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-primary flex items-center">
                                <IndianRupee className="h-4 w-4" />
                                {credit.pricePerCredit.toLocaleString("en-IN")}
                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                  /credit
                                </span>
                              </span>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Buy Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={credit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="h-full glass-strong border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant="outline" className="gap-1 border-secondary/30 text-secondary text-xs">
                            <Star className="h-3 w-3 fill-secondary" />
                            {credit.sellerRating}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mt-3 text-foreground">{credit.projectName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {credit.city}, {credit.state}
                        </p>
                      </CardHeader>
                      <CardContent className="py-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {credit.description}
                        </p>
                        <Badge variant="secondary" className="gap-1 text-xs bg-primary/20 text-primary border-0">
                          <ShieldCheck className="h-3 w-3" />
                          {verLabel}
                        </Badge>
                      </CardContent>
                      <CardFooter className="flex-col gap-3 pt-4">
                        <div className="w-full flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-medium text-foreground">
                            {credit.availableCredits.toLocaleString("en-IN")} credits
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between">
                          <span className="text-lg font-bold text-primary flex items-center">
                            <IndianRupee className="h-4 w-4" />
                            {credit.pricePerCredit.toLocaleString("en-IN")}
                          </span>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                            Buy Now
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredCredits.length === 0 && (
              <div className="text-center py-16">
                <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-4 w-fit mx-auto mb-4">
                  <Leaf className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more carbon credit projects.
                </p>
                <Button variant="outline" onClick={clearFilters} className="border-primary/30 hover:bg-primary/10">
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-primary/10 py-8 bg-card/50 backdrop-blur-sm">
          <div className="container text-center text-sm text-muted-foreground">
            © 2024 Zero Graph. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Marketplace;