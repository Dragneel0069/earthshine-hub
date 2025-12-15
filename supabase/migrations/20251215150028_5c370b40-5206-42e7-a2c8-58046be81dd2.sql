-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create carbon_projects table
CREATE TABLE public.carbon_projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    total_credits DECIMAL NOT NULL DEFAULT 0,
    available_credits DECIMAL NOT NULL DEFAULT 0,
    price_per_credit DECIMAL NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    impact_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carbon_projects ENABLE ROW LEVEL SECURITY;

-- Public can view all projects (marketplace browsing)
CREATE POLICY "Anyone can view carbon projects"
ON public.carbon_projects
FOR SELECT
USING (true);

-- Only admins can insert projects
CREATE POLICY "Admins can create carbon projects"
ON public.carbon_projects
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update projects
CREATE POLICY "Admins can update carbon projects"
ON public.carbon_projects
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete projects
CREATE POLICY "Admins can delete carbon projects"
ON public.carbon_projects
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_carbon_projects_updated_at
BEFORE UPDATE ON public.carbon_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_carbon_projects_type ON public.carbon_projects(project_type);
CREATE INDEX idx_carbon_projects_status ON public.carbon_projects(verification_status);