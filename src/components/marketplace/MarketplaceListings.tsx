import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CreditListingCard, CreditListing } from './CreditListingCard';
import { PurchaseFlow } from './PurchaseFlow';
import { calculateQualityScore } from '@/lib/credit-quality-scoring';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock data for demonstration - in production, this comes from the database
const MOCK_LISTINGS: CreditListing[] = [
  {
    id: '1',
    projectName: 'Gujarat Solar Park Renewable Energy',
    projectType: 'renewable_energy',
    registry: 'verra',
    methodologyId: 'ACM0002',
    vintageYear: 2023,
    pricePerTon: 850,
    availableCredits: 15000,
    country: 'India',
    description: 'A 500MW solar power plant displacing coal-fired electricity generation in Gujarat.',
    qualityScore: 82,
    qualityBreakdown: calculateQualityScore({
      registry: 'verra',
      projectType: 'renewable_energy',
      vintageYear: 2023,
      permanenceRisk: 'low',
      verificationBody: 'dnv',
      sdgAlignment: [7, 8, 13],
      coBenefits: ['job_creation', 'clean_energy'],
    }),
    coBenefits: ['Job Creation', 'Clean Energy', 'Rural Development'],
    sdgAlignment: [7, 8, 13],
    verificationBody: 'DNV',
  },
  {
    id: '2',
    projectName: 'Karnataka Biogas to Energy',
    projectType: 'waste_to_energy',
    registry: 'gold_standard',
    methodologyId: 'GS-VER',
    vintageYear: 2022,
    pricePerTon: 1200,
    availableCredits: 8500,
    country: 'India',
    description: 'Community-based biogas digesters converting agricultural waste to clean cooking fuel.',
    qualityScore: 88,
    qualityBreakdown: calculateQualityScore({
      registry: 'gold_standard',
      projectType: 'waste_to_energy',
      vintageYear: 2022,
      permanenceRisk: 'low',
      verificationBody: 'sgs',
      sdgAlignment: [3, 5, 7, 8, 13],
      coBenefits: ['health', 'gender_equality', 'biodiversity'],
    }),
    coBenefits: ['Health Benefits', 'Gender Equality', 'Waste Reduction'],
    sdgAlignment: [3, 5, 7, 8, 13],
    verificationBody: 'SGS',
  },
  {
    id: '3',
    projectName: 'Sundarbans Mangrove Restoration',
    projectType: 'blue_carbon',
    registry: 'verra',
    methodologyId: 'VM0033',
    vintageYear: 2023,
    pricePerTon: 1800,
    availableCredits: 5000,
    country: 'India',
    description: 'Restoring degraded mangrove ecosystems in the Sundarbans delta for carbon sequestration.',
    qualityScore: 78,
    qualityBreakdown: calculateQualityScore({
      registry: 'verra',
      projectType: 'blue_carbon',
      vintageYear: 2023,
      permanenceRisk: 'medium',
      verificationBody: 'bureau_veritas',
      sdgAlignment: [13, 14, 15],
      coBenefits: ['biodiversity', 'community_development', 'coastal_protection'],
    }),
    coBenefits: ['Biodiversity', 'Coastal Protection', 'Community Livelihoods'],
    sdgAlignment: [13, 14, 15],
    verificationBody: 'Bureau Veritas',
  },
  {
    id: '4',
    projectName: 'Maharashtra Clean Cookstoves',
    projectType: 'cookstoves',
    registry: 'gold_standard',
    methodologyId: 'GS-TPDDTEC',
    vintageYear: 2024,
    pricePerTon: 950,
    availableCredits: 25000,
    country: 'India',
    description: 'Distributing fuel-efficient cookstoves to rural households, reducing fuelwood consumption.',
    qualityScore: 85,
    qualityBreakdown: calculateQualityScore({
      registry: 'gold_standard',
      projectType: 'cookstoves',
      vintageYear: 2024,
      permanenceRisk: 'low',
      verificationBody: 'sgs',
      sdgAlignment: [3, 5, 7, 13, 15],
      coBenefits: ['health', 'gender_equality', 'forest_conservation'],
    }),
    coBenefits: ['Health Improvement', 'Women Empowerment', 'Forest Conservation'],
    sdgAlignment: [3, 5, 7, 13, 15],
    verificationBody: 'SGS',
  },
  {
    id: '5',
    projectName: 'Rajasthan Wind Power',
    projectType: 'renewable_energy',
    registry: 'verra',
    methodologyId: 'ACM0002',
    vintageYear: 2021,
    pricePerTon: 650,
    availableCredits: 30000,
    country: 'India',
    description: 'Wind farm in Jaisalmer district generating clean electricity for the western grid.',
    qualityScore: 75,
    qualityBreakdown: calculateQualityScore({
      registry: 'verra',
      projectType: 'renewable_energy',
      vintageYear: 2021,
      permanenceRisk: 'low',
      verificationBody: 'tuv',
      sdgAlignment: [7, 8, 13],
      coBenefits: ['clean_energy', 'job_creation'],
    }),
    coBenefits: ['Clean Energy', 'Local Employment'],
    sdgAlignment: [7, 8, 13],
    verificationBody: 'TÜV',
  },
  {
    id: '6',
    projectName: 'Tamil Nadu Reforestation',
    projectType: 'afforestation',
    registry: 'verra',
    methodologyId: 'AR-ACM0003',
    vintageYear: 2022,
    pricePerTon: 1100,
    availableCredits: 12000,
    country: 'India',
    description: 'Community-managed afforestation on degraded lands in Tamil Nadu hill districts.',
    qualityScore: 72,
    qualityBreakdown: calculateQualityScore({
      registry: 'verra',
      projectType: 'afforestation',
      vintageYear: 2022,
      permanenceRisk: 'medium',
      verificationBody: 'control_union',
      sdgAlignment: [13, 15, 1, 8],
      coBenefits: ['biodiversity', 'community_development', 'water_security'],
    }),
    coBenefits: ['Biodiversity', 'Water Security', 'Rural Income'],
    sdgAlignment: [13, 15, 1, 8],
    verificationBody: 'Control Union',
  },
];

const PROJECT_TYPES = [
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'afforestation', label: 'Afforestation' },
  { value: 'cookstoves', label: 'Clean Cookstoves' },
  { value: 'waste_to_energy', label: 'Waste to Energy' },
  { value: 'blue_carbon', label: 'Blue Carbon' },
  { value: 'industrial', label: 'Industrial' },
];

const REGISTRIES = [
  { value: 'verra', label: 'Verra (VCS)' },
  { value: 'gold_standard', label: 'Gold Standard' },
];

const VINTAGES = [2024, 2023, 2022, 2021, 2020];

export function MarketplaceListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<CreditListing[]>(MOCK_LISTINGS);
  const [filteredListings, setFilteredListings] = useState<CreditListing[]>(MOCK_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('quality_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegistries, setSelectedRegistries] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [minQualityScore, setMinQualityScore] = useState(0);

  // Purchase state
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = [...listings];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.projectName.toLowerCase().includes(query) ||
        l.country.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query)
      );
    }

    // Project type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(l => selectedTypes.includes(l.projectType));
    }

    // Registry filter
    if (selectedRegistries.length > 0) {
      filtered = filtered.filter(l => selectedRegistries.includes(l.registry));
    }

    // Vintage filter
    if (selectedVintages.length > 0) {
      filtered = filtered.filter(l => selectedVintages.includes(l.vintageYear));
    }

    // Price range filter
    filtered = filtered.filter(l => 
      l.pricePerTon >= priceRange[0] && l.pricePerTon <= priceRange[1]
    );

    // Quality score filter
    if (minQualityScore > 0) {
      filtered = filtered.filter(l => l.qualityScore >= minQualityScore);
    }

    // Sort
    switch (sortBy) {
      case 'quality_desc':
        filtered.sort((a, b) => b.qualityScore - a.qualityScore);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.pricePerTon - b.pricePerTon);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.pricePerTon - a.pricePerTon);
        break;
      case 'vintage_desc':
        filtered.sort((a, b) => b.vintageYear - a.vintageYear);
        break;
      case 'available_desc':
        filtered.sort((a, b) => b.availableCredits - a.availableCredits);
        break;
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, selectedTypes, selectedRegistries, selectedVintages, priceRange, minQualityScore, sortBy]);

  const handlePurchase = (listing: CreditListing) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    setSelectedListing(listing);
    setIsPurchaseOpen(true);
  };

  const handleViewDetails = (listing: CreditListing) => {
    // In production, navigate to detail page
    console.log('View details:', listing.id);
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleRegistryFilter = (registry: string) => {
    setSelectedRegistries(prev =>
      prev.includes(registry) ? prev.filter(r => r !== registry) : [...prev, registry]
    );
  };

  const toggleVintageFilter = (vintage: number) => {
    setSelectedVintages(prev =>
      prev.includes(vintage) ? prev.filter(v => v !== vintage) : [...prev, vintage]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedRegistries([]);
    setSelectedVintages([]);
    setPriceRange([0, 3000]);
    setMinQualityScore(0);
    setSearchQuery('');
  };

  const activeFiltersCount = 
    selectedTypes.length + 
    selectedRegistries.length + 
    selectedVintages.length + 
    (minQualityScore > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quality_desc">Highest Quality</SelectItem>
              <SelectItem value="price_asc">Lowest Price</SelectItem>
              <SelectItem value="price_desc">Highest Price</SelectItem>
              <SelectItem value="vintage_desc">Newest Vintage</SelectItem>
              <SelectItem value="available_desc">Most Available</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Credits</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Project Type */}
                <div>
                  <h4 className="font-medium mb-3">Project Type</h4>
                  <div className="space-y-2">
                    {PROJECT_TYPES.map(type => (
                      <div key={type.value} className="flex items-center gap-2">
                        <Checkbox
                          id={type.value}
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={() => toggleTypeFilter(type.value)}
                        />
                        <label htmlFor={type.value} className="text-sm">{type.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registry */}
                <div>
                  <h4 className="font-medium mb-3">Registry</h4>
                  <div className="space-y-2">
                    {REGISTRIES.map(reg => (
                      <div key={reg.value} className="flex items-center gap-2">
                        <Checkbox
                          id={reg.value}
                          checked={selectedRegistries.includes(reg.value)}
                          onCheckedChange={() => toggleRegistryFilter(reg.value)}
                        />
                        <label htmlFor={reg.value} className="text-sm">{reg.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vintage */}
                <div>
                  <h4 className="font-medium mb-3">Vintage Year</h4>
                  <div className="flex flex-wrap gap-2">
                    {VINTAGES.map(year => (
                      <Badge
                        key={year}
                        variant={selectedVintages.includes(year) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleVintageFilter(year)}
                      >
                        {year}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={3000}
                    step={50}
                    className="mt-2"
                  />
                </div>

                {/* Quality Score */}
                <div>
                  <h4 className="font-medium mb-3">
                    Minimum Quality Score: {minQualityScore}
                  </h4>
                  <Slider
                    value={[minQualityScore]}
                    onValueChange={([v]) => setMinQualityScore(v)}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredListings.length} of {listings.length} projects
        </p>
        {activeFiltersCount > 0 && (
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
      </div>

      {/* Listings grid */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredListings.map(listing => (
            <CreditListingCard
              key={listing.id}
              listing={listing}
              onPurchase={handlePurchase}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Purchase Flow Modal */}
      {selectedListing && (
        <PurchaseFlow
          listing={selectedListing}
          isOpen={isPurchaseOpen}
          onClose={() => {
            setIsPurchaseOpen(false);
            setSelectedListing(null);
          }}
          onSuccess={(orderId) => {
            console.log('Purchase successful:', orderId);
          }}
        />
      )}
    </div>
  );
}
