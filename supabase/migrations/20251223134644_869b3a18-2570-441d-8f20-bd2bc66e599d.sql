-- Create subscription plans enum
CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro', 'enterprise');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'free',
    razorpay_subscription_id TEXT,
    razorpay_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (user_id IN (SELECT id FROM public.users WHERE user_id = auth.uid()));

-- Users can create their own subscription (only one per user)
CREATE POLICY "Users can create their own subscription"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE user_id = auth.uid()));

-- Only system can update subscriptions (via service role in edge functions)
CREATE POLICY "Users can update their own subscription"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (user_id IN (SELECT id FROM public.users WHERE user_id = auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check user's subscription plan
CREATE OR REPLACE FUNCTION public.get_user_plan(_user_id uuid)
RETURNS subscription_plan
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT plan FROM public.subscriptions s
     JOIN public.users u ON s.user_id = u.id
     WHERE u.user_id = _user_id AND s.status = 'active'),
    'free'::subscription_plan
  )
$$;