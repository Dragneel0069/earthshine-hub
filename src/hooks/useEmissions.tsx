import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

// Updated interface for org-centric emissions_records table
export interface EmissionRecord {
  id: string;
  org_id: string;
  scope: number;
  category: string;
  sub_category: string | null;
  source: string | null;
  activity_data: number;
  activity_unit: string;
  emission_factor: number | null;
  emission_factor_source: string | null;
  co2e_kg: number;
  facility_location: string | null;
  reporting_period_start: string;
  reporting_period_end: string;
  reporting_year: number;
  status: 'draft' | 'pending_review' | 'approved' | 'locked' | 'rejected';
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  locked_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  evidence_url: string | null;
  created_at: string;
  updated_at: string;
}

// Legacy interface for backwards compatibility
export interface Emission {
  id: string;
  user_id: string;
  category: string;
  scope: number;
  quantity: number;
  unit: string;
  emission_factor: number | null;
  co2e: number;
  date: string;
  created_at: string;
  updated_at: string;
}

// Convert new records to legacy format for existing components
function toEmission(record: EmissionRecord): Emission {
  return {
    id: record.id,
    user_id: record.created_by,
    category: record.category,
    scope: record.scope,
    quantity: record.activity_data,
    unit: record.activity_unit,
    emission_factor: record.emission_factor,
    co2e: record.co2e_kg / 1000, // Convert kg to tonnes
    date: record.reporting_period_start,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export function useEmissions() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["emissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch from new emissions_records table
      const { data, error } = await supabase
        .from("emissions_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Convert to legacy format for compatibility
      return (data as EmissionRecord[]).map(toEmission);
    },
    enabled: !!user,
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("emissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emissions_records",
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, query]);

  return query;
}

export function useEmissionRecords() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["emissionRecords", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("emissions_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EmissionRecord[];
    },
    enabled: !!user,
  });
}

export function useEmissionsSummary() {
  const { data: emissions, isLoading, error } = useEmissions();

  const summary = emissions && emissions.length > 0
    ? {
        totalEmissions: emissions.reduce((sum, e) => sum + e.co2e, 0),
        byScope: {
          scope1: emissions.filter((e) => e.scope === 1).reduce((sum, e) => sum + e.co2e, 0),
          scope2: emissions.filter((e) => e.scope === 2).reduce((sum, e) => sum + e.co2e, 0),
          scope3: emissions.filter((e) => e.scope === 3).reduce((sum, e) => sum + e.co2e, 0),
        },
        byCategory: emissions.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.co2e;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrend: getMonthlyTrend(emissions),
        recentActivity: emissions.slice(0, 5),
      }
    : null;

  return { summary, isLoading, error };
}

function getMonthlyTrend(emissions: Emission[]) {
  const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
  ];

  const monthlyData: Record<string, number> = {};
  
  emissions.forEach((e) => {
    const date = new Date(e.date);
    const monthKey = date.toLocaleString("en-US", { month: "short" });
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + e.co2e;
  });

  return months.map((month) => ({
    month,
    emissions: monthlyData[month] || 0,
    target: 100,
  }));
}
