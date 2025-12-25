-- Certification types enum
CREATE TYPE public.certification_type AS ENUM ('bcorp', 'cdp', 'gri', 'csrd', 'tcfd', 'sasb', 'sec', 'ecovadis', 'sbti', 'issb');

-- User certifications tracking
CREATE TABLE public.user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    certification_type certification_type NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started',
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    target_date DATE,
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, certification_type)
);

-- Certification milestones/checklist items
CREATE TABLE public.certification_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_certification_id UUID NOT NULL REFERENCES public.user_certifications(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Renewable Energy Certificates (RECs)
CREATE TABLE public.recs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    energy_source VARCHAR(100) NOT NULL,
    quantity_mwh NUMERIC NOT NULL,
    vintage_year INTEGER NOT NULL,
    registry VARCHAR(100),
    certificate_id VARCHAR(100),
    purchase_price NUMERIC,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sustainability quiz responses
CREATE TABLE public.quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    quiz_type VARCHAR(50) NOT NULL DEFAULT 'sustainability_readiness',
    responses JSONB NOT NULL,
    score INTEGER,
    recommendations JSONB,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Climate education blog posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'climate-education',
    tags TEXT[],
    author_name VARCHAR(100) NOT NULL DEFAULT 'Climate Team',
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance reports generated
CREATE TABLE public.compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report_type certification_type NOT NULL,
    reporting_year INTEGER NOT NULL,
    report_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    file_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
);

-- Offset quiz results
CREATE TABLE public.offset_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    preferred_project_types TEXT[],
    preferred_locations TEXT[],
    budget_range VARCHAR(50),
    priority_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certification_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offset_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_certifications
CREATE POLICY "Users can view their own certifications" ON public.user_certifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own certifications" ON public.user_certifications FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own certifications" ON public.user_certifications FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their own certifications" ON public.user_certifications FOR DELETE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- RLS Policies for certification_milestones (via parent)
CREATE POLICY "Users can view their certification milestones" ON public.certification_milestones FOR SELECT USING (user_certification_id IN (SELECT id FROM user_certifications WHERE user_id IN (SELECT id FROM users WHERE user_id = auth.uid())));
CREATE POLICY "Users can create their certification milestones" ON public.certification_milestones FOR INSERT WITH CHECK (user_certification_id IN (SELECT id FROM user_certifications WHERE user_id IN (SELECT id FROM users WHERE user_id = auth.uid())));
CREATE POLICY "Users can update their certification milestones" ON public.certification_milestones FOR UPDATE USING (user_certification_id IN (SELECT id FROM user_certifications WHERE user_id IN (SELECT id FROM users WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete their certification milestones" ON public.certification_milestones FOR DELETE USING (user_certification_id IN (SELECT id FROM user_certifications WHERE user_id IN (SELECT id FROM users WHERE user_id = auth.uid())));

-- RLS Policies for RECs
CREATE POLICY "Users can view their own RECs" ON public.recs FOR SELECT USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own RECs" ON public.recs FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own RECs" ON public.recs FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their own RECs" ON public.recs FOR DELETE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- RLS Policies for quiz_responses
CREATE POLICY "Users can view their own quiz responses" ON public.quiz_responses FOR SELECT USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()) OR user_id IS NULL);
CREATE POLICY "Anyone can create quiz responses" ON public.quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own quiz responses" ON public.quiz_responses FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- RLS Policies for blog_posts (public read, admin write)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view their own compliance reports" ON public.compliance_reports FOR SELECT USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own compliance reports" ON public.compliance_reports FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own compliance reports" ON public.compliance_reports FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their own compliance reports" ON public.compliance_reports FOR DELETE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- RLS Policies for offset_preferences
CREATE POLICY "Users can view their own offset preferences" ON public.offset_preferences FOR SELECT USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own offset preferences" ON public.offset_preferences FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own offset preferences" ON public.offset_preferences FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_user_certifications_updated_at BEFORE UPDATE ON public.user_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offset_preferences_updated_at BEFORE UPDATE ON public.offset_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts for climate education
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, tags, is_published, published_at) VALUES
('Understanding Scope 1, 2, and 3 Emissions', 'understanding-scope-emissions', 'Learn the difference between direct and indirect emissions and why tracking all three scopes matters for your climate strategy.', E'# Understanding Scope 1, 2, and 3 Emissions\n\nCarbon emissions are categorized into three scopes to help organizations understand their environmental impact.\n\n## Scope 1: Direct Emissions\nThese are emissions from sources owned or controlled by your organization, such as company vehicles, on-site fuel combustion, and manufacturing processes.\n\n## Scope 2: Indirect Emissions from Energy\nThese come from purchased electricity, steam, heating, and cooling. While you don''t directly produce these emissions, your energy consumption drives them.\n\n## Scope 3: Value Chain Emissions\nThe broadest category, covering all other indirect emissions including business travel, employee commuting, purchased goods and services, and product use.', 'climate-education', ARRAY['emissions', 'carbon-accounting', 'sustainability'], true, now()),
('Getting Started with Carbon Accounting', 'getting-started-carbon-accounting', 'A beginner''s guide to measuring and managing your organization''s carbon footprint.', E'# Getting Started with Carbon Accounting\n\nCarbon accounting is the process of measuring and tracking your organization''s greenhouse gas emissions.\n\n## Why Carbon Accounting Matters\n- Meet regulatory requirements (CSRD, SEC Climate Disclosure)\n- Respond to customer demands\n- Identify cost-saving opportunities\n- Build a credible sustainability program\n\n## Steps to Get Started\n1. **Define your boundaries** - Determine what parts of your organization to include\n2. **Gather data** - Collect energy bills, travel records, and supply chain information\n3. **Calculate emissions** - Apply emission factors to convert activities to CO2e\n4. **Set targets** - Establish reduction goals aligned with science-based targets\n5. **Report and improve** - Share progress and continuously optimize', 'climate-education', ARRAY['carbon-accounting', 'getting-started', 'sustainability'], true, now()),
('What is CSRD and How Does It Affect Your Business?', 'csrd-compliance-guide', 'The Corporate Sustainability Reporting Directive is changing how European companies report on sustainability.', E'# CSRD Compliance Guide\n\nThe Corporate Sustainability Reporting Directive (CSRD) is the EU''s new sustainability reporting standard.\n\n## Who Needs to Comply?\n- Large EU companies (250+ employees or €40M+ revenue)\n- Listed SMEs\n- Non-EU companies with significant EU revenue\n\n## Timeline\n- 2024: Large public-interest entities\n- 2025: Other large companies\n- 2026: Listed SMEs\n\n## Key Requirements\n- Double materiality assessment\n- Scope 1, 2, and 3 emissions reporting\n- Third-party assurance\n- Digital tagging for reports', 'compliance', ARRAY['csrd', 'compliance', 'reporting', 'eu-regulations'], true, now()),
('Carbon Offsets: A Complete Guide', 'carbon-offsets-guide', 'Understanding how carbon offsets work and how to choose quality projects for your net-zero strategy.', E'# Carbon Offsets: A Complete Guide\n\nCarbon offsets allow organizations to compensate for emissions they cannot yet eliminate.\n\n## Types of Offset Projects\n- **Forestry** - Reforestation, avoided deforestation\n- **Renewable Energy** - Wind, solar, hydro projects\n- **Methane Capture** - Landfill gas, agricultural waste\n- **Direct Air Capture** - Emerging technology solutions\n\n## Quality Indicators\n- Third-party verification (Gold Standard, Verra)\n- Additionality - Would the project happen without offset funding?\n- Permanence - How long will the carbon stay stored?\n- Co-benefits - Community and biodiversity impacts\n\n## Best Practices\n1. Prioritize emission reductions first\n2. Use offsets for unavoidable emissions\n3. Choose high-quality, verified projects\n4. Be transparent about offset use', 'climate-education', ARRAY['offsets', 'net-zero', 'carbon-credits'], true, now());
