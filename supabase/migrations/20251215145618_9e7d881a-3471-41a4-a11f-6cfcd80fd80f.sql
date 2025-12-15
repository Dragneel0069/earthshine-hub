-- Create emissions table for tracking carbon emissions
CREATE TABLE public.emissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    scope INTEGER NOT NULL CHECK (scope IN (1, 2, 3)),
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL NOT NULL,
    unit VARCHAR(20) NOT NULL,
    emission_factor DECIMAL,
    co2e DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emissions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own emissions" 
ON public.emissions 
FOR SELECT 
USING (user_id IN (SELECT id FROM public.users WHERE public.users.user_id = auth.uid()));

CREATE POLICY "Users can create their own emissions" 
ON public.emissions 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE public.users.user_id = auth.uid()));

CREATE POLICY "Users can update their own emissions" 
ON public.emissions 
FOR UPDATE 
USING (user_id IN (SELECT id FROM public.users WHERE public.users.user_id = auth.uid()));

CREATE POLICY "Users can delete their own emissions" 
ON public.emissions 
FOR DELETE 
USING (user_id IN (SELECT id FROM public.users WHERE public.users.user_id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emissions_updated_at
BEFORE UPDATE ON public.emissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_emissions_user_id ON public.emissions(user_id);
CREATE INDEX idx_emissions_date ON public.emissions(date);
CREATE INDEX idx_emissions_scope ON public.emissions(scope);