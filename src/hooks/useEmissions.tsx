import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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

export function useEmissions() {
  const query = useQuery({
    queryKey: ["emissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emissions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Emission[];
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("emissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emissions",
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
}

export function useEmissionsSummary() {
  const { data: emissions, isLoading, error } = useEmissions();

  const summary = emissions
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
    target: 100, // Default target
  }));
}
