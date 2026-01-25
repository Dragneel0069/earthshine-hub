import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { QualityScoreBreakdown } from '@/lib/credit-quality-scoring';

export type CreditsCatalogRow = Tables<'credits_catalog'>;

export interface CatalogListing {
  id: string;
  projectName: string;
  projectType: string;
  registry: string;
  methodologyId?: string;
  vintageYear: number;
  pricePerTon: number;
  availableCredits: number;
  country: string;
  state?: string;
  description?: string;
  qualityScore: number;
  qualityBreakdown: QualityScoreBreakdown;
  coBenefits?: string[];
  sdgAlignment?: number[];
  verificationBody?: string;
  imageUrl?: string;
  documentationUrl?: string;
}

// Transform database row to UI-friendly format
function transformCatalogRow(row: CreditsCatalogRow): CatalogListing {
  return {
    id: row.id,
    projectName: row.project_name,
    projectType: row.project_type,
    registry: row.registry,
    methodologyId: row.methodology_id || undefined,
    vintageYear: row.vintage_year,
    pricePerTon: Number(row.price_per_ton),
    availableCredits: Number(row.available_credits),
    country: row.country,
    state: row.state || undefined,
    description: row.description || undefined,
    qualityScore: row.quality_score,
    qualityBreakdown: (row.quality_breakdown as unknown as QualityScoreBreakdown) || {
      additionality: 0,
      permanence: 0,
      verification: 0,
      vintage: 0,
      registry: 0,
      leakage: 0,
      coBenefits: 0,
      total: 0,
    },
    coBenefits: row.co_benefits || undefined,
    sdgAlignment: row.sdg_alignment || undefined,
    verificationBody: row.verification_body || undefined,
    imageUrl: row.image_url || undefined,
    documentationUrl: row.documentation_url || undefined,
  };
}

interface UseCreditsCatalogOptions {
  projectTypes?: string[];
  registries?: string[];
  vintages?: number[];
  minPrice?: number;
  maxPrice?: number;
  minQualityScore?: number;
  searchQuery?: string;
}

export function useCreditsCatalog(options: UseCreditsCatalogOptions = {}) {
  const [listings, setListings] = useState<CatalogListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('credits_catalog')
        .select('*')
        .eq('is_active', true)
        .gt('available_credits', 0)
        .order('quality_score', { ascending: false });

      // Apply filters
      if (options.projectTypes && options.projectTypes.length > 0) {
        query = query.in('project_type', options.projectTypes);
      }

      if (options.registries && options.registries.length > 0) {
        query = query.in('registry', options.registries);
      }

      if (options.vintages && options.vintages.length > 0) {
        query = query.in('vintage_year', options.vintages);
      }

      if (options.minPrice !== undefined) {
        query = query.gte('price_per_ton', options.minPrice);
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('price_per_ton', options.maxPrice);
      }

      if (options.minQualityScore !== undefined && options.minQualityScore > 0) {
        query = query.gte('quality_score', options.minQualityScore);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let transformedListings = (data || []).map(transformCatalogRow);

      // Apply client-side search filter (Supabase doesn't support full-text search without extensions)
      if (options.searchQuery) {
        const searchLower = options.searchQuery.toLowerCase();
        transformedListings = transformedListings.filter(
          (listing) =>
            listing.projectName.toLowerCase().includes(searchLower) ||
            listing.country.toLowerCase().includes(searchLower) ||
            listing.description?.toLowerCase().includes(searchLower) ||
            listing.state?.toLowerCase().includes(searchLower)
        );
      }

      setListings(transformedListings);
    } catch (err) {
      console.error('Error fetching credits catalog:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch credits'));
    } finally {
      setLoading(false);
    }
  }, [
    options.projectTypes?.join(','),
    options.registries?.join(','),
    options.vintages?.join(','),
    options.minPrice,
    options.maxPrice,
    options.minQualityScore,
    options.searchQuery,
  ]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
  };
}
