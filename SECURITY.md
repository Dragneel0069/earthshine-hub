# Zero Graph Security Architecture

## 🏗️ Security Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          INTERNET / USERS                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CDN + WAF LAYER (Cloudflare/Fastly)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ DDoS        │  │ Bot         │  │ Rate        │  │ Geo-blocking    │ │
│  │ Protection  │  │ Management  │  │ Limiting    │  │ (optional)      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ TLS 1.3     │  │ Security    │  │ Request     │  │ IP             │ │
│  │ Termination │  │ Headers     │  │ Filtering   │  │ Reputation     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                 │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │       FRONTEND (React/Vite)    │  │    EDGE FUNCTIONS (Deno)       │ │
│  │  • CSP enforcement             │  │  • JWT validation              │ │
│  │  • Input validation (Zod)      │  │  • Rate limiting               │ │
│  │  • XSS prevention              │  │  • Request signing             │ │
│  │  • Secure session handling     │  │  • Input validation            │ │
│  │  • CSRF protection             │  │  • Admin role checks           │ │
│  └────────────────────────────────┘  └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (Supabase)                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Row Level       │  │ Database        │  │ Audit Logging           │  │
│  │ Security (RLS)  │  │ Functions       │  │ (ledger table)          │  │
│  │ • Org isolation │  │ • SET search_   │  │ • Action tracking       │  │
│  │ • Permission    │  │   path = public │  │ • IP logging            │  │
│  │   checks        │  │ • SECURITY      │  │ • State changes         │  │
│  │ • Owner-only    │  │   DEFINER       │  │                         │  │
│  │   access        │  │ • Parameterized │  │                         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Protection Layers

### 1. CDN + WAF Configuration (Cloudflare Recommended)

**Required Settings:**
```
SSL/TLS: Full (strict)
Minimum TLS Version: 1.2
Always Use HTTPS: ON
HSTS: ON (max-age: 2 years, includeSubDomains, preload)
```

**Rate Limiting Rules:**
```
Rule 1: Login Endpoint
- Path: /api/auth/*
- Rate: 10 requests per minute per IP
- Action: Challenge then Block

Rule 2: API Endpoints
- Path: /functions/*
- Rate: 60 requests per minute per IP
- Action: Challenge then Block

Rule 3: Global
- Rate: 1000 requests per minute per IP
- Action: Challenge
```

**WAF Rules (OWASP Core Ruleset):**
```
- SQL Injection: Block
- XSS: Block
- Remote Code Execution: Block
- Path Traversal: Block
- Protocol Violations: Block
- Log4j: Block
```

**Bot Management:**
```
- Known Bots: Allow (verified)
- Likely Bots: Challenge
- Automated: Block
- Unverified: Challenge
```

---

### 2. Security Headers Configuration

Add to your hosting/CDN configuration:

```nginx
# Nginx Configuration
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(self)" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://ai.gateway.lovable.dev https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ai.gateway.lovable.dev; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests" always;
```

**Cloudflare Workers (alternative):**
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return newResponse;
}
```

---

### 3. Authentication Security

**Password Policy:**
- Minimum 8 characters (recommended: 12+)
- Mixed case + numbers required
- Common patterns blocked
- Password strength indicator in UI

**Supabase Auth Configuration:**
```sql
-- Enable leaked password protection (via Supabase Dashboard)
-- Auth > Settings > Security > Enable "Check passwords against breached database"

-- Rate limiting is built-in:
-- - 10 sign-up requests per hour per IP
-- - 30 login attempts per hour per IP
```

**Session Security:**
- 30-minute idle timeout
- 24-hour absolute timeout
- Activity-based session extension
- Secure session storage (httpOnly cookies by Supabase)

**MFA Recommendation:**
Enable MFA in Supabase Dashboard:
- Auth > Settings > MFA
- Enable TOTP (Time-based One-Time Password)

---

### 4. Database Security (RLS Policies)

**Current RLS Implementation:**

✅ **Organization Isolation:**
```sql
-- Example: emissions_records table
CREATE POLICY "Members can view emissions" 
ON emissions_records FOR SELECT 
USING (has_permission(auth.uid(), org_id, 'can_view_emissions'::permission_type));
```

✅ **Owner-Only Access:**
```sql
-- Example: rag_conversations table
CREATE POLICY "Users can view their own conversations" 
ON rag_conversations FOR SELECT 
USING (auth.uid() = user_id);
```

✅ **Permission-Based Access:**
```sql
-- Uses database functions with SET search_path = public
CREATE FUNCTION has_permission(_user_id uuid, _org_id uuid, _permission permission_type)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE user_id = _user_id 
      AND org_id = _org_id 
      AND _permission = ANY(permissions)
  )
$$;
```

**Tables with RLS Enabled:**
- ✅ organizations
- ✅ organization_members
- ✅ profiles
- ✅ emissions_records
- ✅ reports
- ✅ credit_orders
- ✅ credits_catalog
- ✅ retirement_proofs
- ✅ ledger
- ✅ rag_conversations
- ✅ rag_messages
- ✅ rag_documents
- ✅ rag_chunks
- ✅ blog_posts
- ✅ audit_logs

---

### 5. API Security (Edge Functions)

**Current Protections:**
- ✅ JWT Authentication
- ✅ Rate Limiting (IP + User based)
- ✅ Request Signing (replay attack prevention)
- ✅ Input Validation (length, type, format)
- ✅ Admin Role Verification (rag-embed)

**Rate Limits:**
```
rag-chat: 20 req/min per IP, 30 req/min per user
rag-embed: 10 req/min per IP, 15 req/min per user (admin only)
```

**Request Signing Headers:**
```
X-Request-Timestamp: Unix timestamp (ms)
X-Request-Nonce: 32-char hex (single-use)
X-Request-Signature: SHA-256 HMAC
```

---

### 6. Frontend Security

**Input Validation (Zod):**
```typescript
// All forms use Zod schemas
import { loginSchema, signupSchema } from '@/lib/validation';

// Example validation
const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  // Handle validation errors
}
```

**XSS Prevention:**
- React JSX auto-escaping
- No dangerouslySetInnerHTML with user content
- URL sanitization for external links
- HTML encoding utilities available

**Form Security:**
- Honeypot fields for bot detection
- Submission timing validation
- CSRF tokens for sensitive actions

---

## 📋 Deployment Security Checklist

### Pre-Deployment
- [ ] Remove all console.log statements with sensitive data
- [ ] Verify no secrets in codebase (only publishable keys)
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update dependencies to latest secure versions
- [ ] Review RLS policies for all tables
- [ ] Test authentication flows

### CDN/Hosting Configuration
- [ ] Enable HTTPS with TLS 1.2+
- [ ] Configure HSTS header
- [ ] Set up WAF rules
- [ ] Configure rate limiting
- [ ] Enable DDoS protection
- [ ] Set security headers

### Supabase Configuration
- [ ] Enable leaked password protection
- [ ] Verify RLS enabled on all tables
- [ ] Review function search_path settings
- [ ] Enable audit logging
- [ ] Configure backup policies

### Post-Deployment
- [ ] Test all security headers (securityheaders.com)
- [ ] Verify CSP doesn't break functionality
- [ ] Test rate limiting behavior
- [ ] Monitor error logs for security events
- [ ] Set up alerts for auth failures

---

## 🚨 Incident Response Checklist

### Suspected Breach
1. **Immediate Actions (First 15 minutes)**
   - Enable maintenance mode (if available)
   - Rotate Supabase service role key
   - Review recent auth logs
   - Check for unauthorized data access

2. **Investigation (First hour)**
   - Analyze audit_logs and ledger tables
   - Review Edge Function logs
   - Check CDN access logs
   - Identify affected users/data

3. **Remediation**
   - Patch identified vulnerabilities
   - Force password reset if credentials compromised
   - Revoke affected sessions
   - Update RLS policies if needed

4. **Communication**
   - Notify affected users (if data exposed)
   - Document incident timeline
   - Update security measures

### DDoS Attack
1. Enable Cloudflare "Under Attack" mode
2. Increase rate limiting thresholds
3. Enable additional bot challenges
4. Monitor origin server health
5. Scale infrastructure if needed

---

## 🔧 Security Monitoring

### Recommended Alerts
- Failed login attempts > 10/hour per IP
- Rate limit triggers > 100/hour
- 4xx/5xx errors spike > 50%
- Edge function errors
- RLS policy violations

### Log Analysis Queries
```sql
-- Recent auth failures
SELECT * FROM auth_logs 
WHERE metadata->>'status' != '200' 
ORDER BY timestamp DESC 
LIMIT 100;

-- Suspicious API activity
SELECT ip_address, COUNT(*) as requests
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 100
ORDER BY requests DESC;

-- Failed database operations
SELECT * FROM postgres_logs
WHERE parsed->>'error_severity' = 'ERROR'
ORDER BY timestamp DESC
LIMIT 50;
```

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Cloudflare Security Features](https://developers.cloudflare.com/waf/)

---

*Last Updated: January 2026*
*Security Contact: security@zerograph.in*
