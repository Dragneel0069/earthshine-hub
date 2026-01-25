import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';
import type { Tables, Enums } from '@/integrations/supabase/types';

type CreditOrder = Tables<'credit_orders'>;
type RetirementProof = Tables<'retirement_proofs'>;
type OrderStatus = Enums<'order_status'>;

export interface OrderWithDetails extends CreditOrder {
  catalog?: Tables<'credits_catalog'>;
  retirement_proof?: RetirementProof;
}

export function useMarketplaceOrders() {
  const { organization, loading: orgLoading } = useOrganization();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [certificates, setCertificates] = useState<RetirementProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!organization) {
      setOrders([]);
      setCertificates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch orders for this organization
      const { data: ordersData, error: ordersError } = await supabase
        .from('credit_orders')
        .select(`
          *,
          catalog:credits_catalog(*)
        `)
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch retirement certificates
      const { data: certificatesData, error: certsError } = await supabase
        .from('retirement_proofs')
        .select('*')
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false });

      if (certsError) throw certsError;

      // Map certificates to orders
      const ordersWithCerts = (ordersData || []).map((order) => ({
        ...order,
        retirement_proof: certificatesData?.find((cert) => cert.order_id === order.id),
      }));

      setOrders(ordersWithCerts);
      setCertificates(certificatesData || []);
    } catch (err) {
      console.error('Error fetching marketplace orders:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (!orgLoading) {
      fetchOrders();
    }
  }, [orgLoading, fetchOrders]);

  const initiateOrder = async (params: {
    catalogId: string;
    quantity: number;
    beneficiaryName?: string;
    beneficiaryType?: string;
    retirementReason?: string;
  }) => {
    if (!organization) throw new Error('No organization selected');

    const { data, error } = await supabase.rpc('initiate_order', {
      _catalog_id: params.catalogId,
      _org_id: organization.id,
      _quantity: params.quantity,
      _beneficiary_name: params.beneficiaryName,
      _beneficiary_type: params.beneficiaryType,
      _retirement_reason: params.retirementReason,
    });

    if (error) throw error;
    
    await fetchOrders(); // Refresh orders list
    return data as { order_id: string; order_number: string; total_amount: number };
  };

  const markOrderPaid = async (orderId: string, paymentReference: string) => {
    const { data, error } = await supabase.rpc('mark_order_paid', {
      _order_id: orderId,
      _payment_reference: paymentReference,
    });

    if (error) throw error;
    
    await fetchOrders();
    return data;
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    const { data, error } = await supabase.rpc('cancel_order', {
      _order_id: orderId,
      _reason: reason,
    });

    if (error) throw error;
    
    await fetchOrders();
    return data;
  };

  const completeRetirement = async (orderId: string, registryRetirementId?: string) => {
    const { data, error } = await supabase.rpc('complete_retirement', {
      _order_id: orderId,
      _registry_retirement_id: registryRetirementId,
    });

    if (error) throw error;
    
    await fetchOrders();
    return data;
  };

  return {
    orders,
    certificates,
    loading: loading || orgLoading,
    error,
    refetch: fetchOrders,
    initiateOrder,
    markOrderPaid,
    cancelOrder,
    completeRetirement,
  };
}
