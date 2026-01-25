import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CreditListingCard, CreditListing } from './CreditListingCard';
import { PurchaseFlow } from './PurchaseFlow';
import { useCreditsCatalog, CatalogListing } from '@/hooks/useCreditsCatalog';
import { useAuth } from '@/hooks/useAuth';

const PROJECT_TYPES = [
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'afforestation', label: 'Afforestation' },
  { value: 'reforestation', label: 'Reforestation' },
  { value: 'cookstoves', label: 'Clean Cookstoves' },
  { value: 'waste_to_energy', label: 'Waste to Energy' },
  { value: 'blue_carbon', label: 'Blue Carbon' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'avoided_deforestation', label: 'REDD+' },
];

const REGISTRIES = [
  { value: 'verra', label: 'Verra (VCS)' },
  { value: 'gold_standard', label: 'Gold Standard' },
  { value: 'american_carbon_registry', label: 'ACR' },
  { value: 'climate_action_reserve', label: 'CAR' },
];

const VINTAGES = [2025, 2024, 2023, 2022, 2021, 2020];

// Convert CatalogListing to CreditListing for compatibility with CreditListingCard
function toCreditListing(catalog: CatalogListing): CreditListing {
  return {
    id: catalog.id,
    projectName: catalog.projectName,
    projectType: catalog.projectType,
    registry: catalog.registry,
    methodologyId: catalog.methodologyId,
    vintageYear: catalog.vintageYear,
    pricePerTon: catalog.pricePerTon,
    availableCredits: catalog.availableCredits,
    country: catalog.country,
    description: catalog.description,
    qualityScore: catalog.qualityScore,
    qualityBreakdown: catalog.qualityBreakdown,
    coBenefits: catalog.coBenefits,
    sdgAlignment: catalog.sdgAlignment,
    verificationBody: catalog.verificationBody,
    imageUrl: catalog.imageUrl,
  };
}

export function MarketplaceListings() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('quality_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegistries, setSelectedRegistries] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minQualityScore, setMinQualityScore] = useState(0);

  // Purchase state
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch from database with filters
  const { listings: catalogListings, loading, error, refetch } = useCreditsCatalog({
    projectTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
    registries: selectedRegistries.length > 0 ? selectedRegistries : undefined,
    vintages: selectedVintages.length > 0 ? selectedVintages : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    minQualityScore: minQualityScore > 0 ? minQualityScore : undefined,
    searchQuery: debouncedSearch || undefined,
  });

  // Apply client-side sorting
  const sortedListings = useMemo(() => {
    const listings = [...catalogListings];
    
    switch (sortBy) {
      case 'quality_desc':
        listings.sort((a, b) => b.qualityScore - a.qualityScore);
        break;
      case 'price_asc':
        listings.sort((a, b) => a.pricePerTon - b.pricePerTon);
        break;
      case 'price_desc':
        listings.sort((a, b) => b.pricePerTon - a.pricePerTon);
        break;
      case 'vintage_desc':
        listings.sort((a, b) => b.vintageYear - a.vintageYear);
        break;
      case 'available_desc':
        listings.sort((a, b) => b.availableCredits - a.availableCredits);
        break;
    }

    return listings;
  }, [catalogListings, sortBy]);

  const handlePurchase = (listing: CreditListing) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelectedListing(listing);
    setIsPurchaseOpen(true);
  };

  const handleViewDetails = (listing: CreditListing) => {
    // TODO: Navigate to detail page
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
    setPriceRange([0, 5000]);
    setMinQualityScore(0);
    setSearchQuery('');
  };

  const activeFiltersCount = 
    selectedTypes.length + 
    selectedRegistries.length + 
    selectedVintages.length + 
    (minQualityScore > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

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
                    max={5000}
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
          Showing {sortedListings.length} project{sortedListings.length !== 1 ? 's' : ''}
        </p>
        {activeFiltersCount > 0 && (
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Projects</h3>
            <p className="text-muted-foreground">Fetching verified carbon credits...</p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Leaf className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Projects</h3>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && !error && sortedListings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </CardContent>
        </Card>
      )}

      {/* Listings grid */}
      {!loading && !error && sortedListings.length > 0 && (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {sortedListings.map(catalogListing => (
            <CreditListingCard
              key={catalogListing.id}
              listing={toCreditListing(catalogListing)}
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
            refetch(); // Refresh listings after purchase
          }}
        />
      )}
    </div>
  );
}
