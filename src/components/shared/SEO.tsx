import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://zerograph.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'Zero Graph';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zero Graph',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "India's leading carbon accounting and BRSR compliance platform for enterprises and SMEs.",
  foundingDate: '2024',
  areaServed: 'IN',
  sameAs: [
    'https://x.com/zeraboronkagraph',
    'https://www.linkedin.com/company/zero-graph',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@zerograph.in',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/knowledge-agent?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export function SEO({
  title,
  description = "Zero Graph is India's #1 carbon accounting platform. Track emissions, automate BRSR compliance, buy verified carbon credits, and achieve net zero.",
  keywords = 'zerograph, zero graph, carbon accounting India, carbon footprint calculator, BRSR compliance, carbon credits India, emissions tracking, sustainability platform, GHG protocol, net zero India, ESG reporting, carbon offset',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - India's #1 Carbon Accounting & BRSR Compliance Platform`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}