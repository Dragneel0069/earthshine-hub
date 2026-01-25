-- Fix remaining functions with mutable search_path

-- Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'ZG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                      LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Fix generate_certificate_number function
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.certificate_number := 'ZG-CERT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Fix update_batch_on_order function (already has SECURITY DEFINER, add search_path)
CREATE OR REPLACE FUNCTION public.update_batch_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When payment confirmed, move credits to reserved
  IF NEW.payment_status = 'completed' AND OLD.payment_status = 'pending' AND NEW.escrow_status = 'held' THEN
    UPDATE credit_batches
    SET available_credits = available_credits - NEW.credits_purchased,
        reserved_credits = reserved_credits + NEW.credits_purchased,
        updated_at = now()
    WHERE id = NEW.batch_id;
    
    -- Log to ledger
    INSERT INTO credit_ledger (batch_id, order_id, action, credits_amount, actor_id, metadata)
    VALUES (NEW.batch_id, NEW.id, 'reserved', NEW.credits_purchased, NEW.buyer_id, 
            jsonb_build_object('order_number', NEW.order_number));
  END IF;
  
  -- When retirement confirmed, move to retired
  IF NEW.retirement_status = 'confirmed' AND OLD.retirement_status != 'confirmed' THEN
    UPDATE credit_batches
    SET reserved_credits = reserved_credits - NEW.credits_purchased,
        retired_credits = retired_credits + NEW.credits_purchased,
        updated_at = now()
    WHERE id = NEW.batch_id;
    
    -- Log to ledger
    INSERT INTO credit_ledger (batch_id, order_id, action, credits_amount, actor_id, metadata)
    VALUES (NEW.batch_id, NEW.id, 'retired', NEW.credits_purchased, NEW.buyer_id,
            jsonb_build_object('registry_id', NEW.registry_retirement_id));
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix handle_new_user_role function
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;