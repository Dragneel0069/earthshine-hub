import { MapPin, Calendar, Leaf, Award, TrendingUp, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QualityScoreCard } from './QualityScoreCard';
import { QualityScoreBreakdown, getQualityTier } from '@/lib/credit-quality-scoring';

export interface CreditListing {
  id: string;
  projectName: string;
  projectType: string;
  registry: string;
  methodologyId?: string;
  vintageYear: number;
  pricePerTon: number;
  availableCredits: number;
  country: string;
  description?: string;
  qualityScore: number;
  qualityBreakdown: QualityScoreBreakdown;
  coBenefits?: string[];
  sdgAlignment?: number[];
  verificationBody?: string;
  imageUrl?: string;
}

interface CreditListingCardProps {
  listing: CreditListing;
  onPurchase: (listing: CreditListing) => void;
  onViewDetails: (listing: CreditListing) => void;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'renewable_energy': 'Renewable Energy',
  'afforestation': 'Afforestation',
  'reforestation': 'Reforestation',
  'avoided_deforestation': 'REDD+',
  'cookstoves': 'Clean Cookstoves',
  'waste_to_energy': 'Waste to Energy',
  'industrial': 'Industrial Efficiency',
  'blue_carbon': 'Blue Carbon',
  'biochar': 'Biochar',
  'direct_air_capture': 'Direct Air Capture',
  'soil_carbon': 'Soil Carbon',
  'geological_storage': 'Geological Storage',
  'energy_efficiency': 'Energy Efficiency',
};

const REGISTRY_LOGOS: Record<string, string> = {
  'verra': '🌿',
  'gold_standard': '⭐',
  'american_carbon_registry': '🇺🇸',
  'climate_action_reserve': '🌎',
  'puro_earth': '🌍',
};

const SDG_ICONS: Record<number, { icon: string; name: string }> = {
  1: { icon: '🎯', name: 'No Poverty' },
  2: { icon: '🌾', name: 'Zero Hunger' },
  3: { icon: '💚', name: 'Good Health' },
  4: { icon: '📚', name: 'Quality Education' },
  5: { icon: '⚖️', name: 'Gender Equality' },
  6: { icon: '💧', name: 'Clean Water' },
  7: { icon: '⚡', name: 'Clean Energy' },
  8: { icon: '📈', name: 'Decent Work' },
  9: { icon: '🏭', name: 'Innovation' },
  10: { icon: '🤝', name: 'Reduced Inequality' },
  11: { icon: '🏘️', name: 'Sustainable Cities' },
  12: { icon: '♻️', name: 'Responsible Consumption' },
  13: { icon: '🌡️', name: 'Climate Action' },
  14: { icon: '🐋', name: 'Life Below Water' },
  15: { icon: '🌳', name: 'Life on Land' },
  16: { icon: '☮️', name: 'Peace & Justice' },
  17: { icon: '🤲', name: 'Partnerships' },
};

export function CreditListingCard({ listing, onPurchase, onViewDetails }: CreditListingCardProps) {
  const tier = getQualityTier(listing.qualityScore);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with image or gradient */}
      <div 
        className="h-32 relative bg-gradient-to-br from-primary/10 to-primary/5"
        style={listing.imageUrl ? { backgroundImage: `url(${listing.imageUrl})`, backgroundSize: 'cover' } : undefined}
      >
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {REGISTRY_LOGOS[listing.registry] || '📜'} {listing.registry.toUpperCase()}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            className={`${tier.tier === 'premium' ? 'bg-emerald-500' : 
              tier.tier === 'high' ? 'bg-green-500' :
              tier.tier === 'standard' ? 'bg-yellow-500' :
              'bg-orange-500'} text-white`}
          >
            {listing.qualityScore}/100
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            {PROJECT_TYPE_LABELS[listing.projectType] || listing.projectType}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{listing.projectName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{listing.country}</span>
              <span>•</span>
              <Calendar className="h-3.5 w-3.5" />
              <span>Vintage {listing.vintageYear}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Quality Score Summary */}
        <QualityScoreCard 
          score={listing.qualityScore} 
          breakdown={listing.qualityBreakdown} 
          compact 
        />

        {/* SDG Alignment */}
        {listing.sdgAlignment && listing.sdgAlignment.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">SDGs:</span>
            {listing.sdgAlignment.slice(0, 5).map(sdg => (
              <span key={sdg} title={SDG_ICONS[sdg]?.name} className="text-sm">
                {SDG_ICONS[sdg]?.icon}
              </span>
            ))}
            {listing.sdgAlignment.length > 5 && (
              <span className="text-xs text-muted-foreground">+{listing.sdgAlignment.length - 5}</span>
            )}
          </div>
        )}

        {/* Co-benefits */}
        {listing.coBenefits && listing.coBenefits.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.coBenefits.slice(0, 3).map(benefit => (
              <Badge key={benefit} variant="outline" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-2xl font-bold">
              ₹{listing.pricePerTon.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per tCO₂e</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-green-600">
              {listing.availableCredits.toLocaleString()} available
            </p>
            <p className="text-xs text-muted-foreground">credits</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onViewDetails(listing)}>
          View Details
        </Button>
        <Button className="flex-1" onClick={() => onPurchase(listing)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
