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

### 1. Cloudflare Production Configuration

#### Step 1: Add Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site" → Enter `zerograph.in`
3. Select plan (Pro recommended for WAF)
4. Update nameservers at your registrar to Cloudflare's NS records

#### Step 2: SSL/TLS Configuration

**Dashboard Path:** `zerograph.in` → SSL/TLS → Overview

```yaml
Encryption Mode: Full (strict)
Always Use HTTPS: ON
Minimum TLS Version: TLS 1.2
TLS 1.3: ON
Automatic HTTPS Rewrites: ON
```

**Dashboard Path:** `zerograph.in` → SSL/TLS → Edge Certificates

```yaml
HSTS: 
  Status: ON
  Max Age: 12 months (31536000)
  Include Subdomains: ON
  Preload: ON
  No-Sniff Header: ON
```

#### Step 3: WAF Rules Configuration

**Dashboard Path:** `zerograph.in` → Security → WAF → Managed Rules

**Enable OWASP Core Ruleset:**
```yaml
Cloudflare Managed Ruleset: ON
  Action: Block
  Sensitivity: High

OWASP Core Ruleset: ON
  Paranoia Level: PL2
  Action: Block
  
Specific Rule Categories:
  - SQL Injection: Block
  - Cross-Site Scripting (XSS): Block
  - Remote Code Execution (RCE): Block
  - Local File Inclusion (LFI): Block
  - PHP Injection: Block
  - Command Injection: Block
  - Log4j (CVE-2021-44228): Block
```

**Dashboard Path:** `zerograph.in` → Security → WAF → Custom Rules

**Rule 1: Block Known Attack Patterns**
```json
{
  "expression": "(http.request.uri.query contains \"<script\") or (http.request.uri.query contains \"javascript:\") or (http.request.uri.query contains \"onerror=\") or (http.request.body.raw contains \"<script\")",
  "action": "block",
  "description": "Block XSS attack patterns"
}
```

**Rule 2: Block SQL Injection Patterns**
```json
{
  "expression": "(http.request.uri.query contains \"UNION SELECT\") or (http.request.uri.query contains \"1=1\") or (http.request.uri.query contains \"DROP TABLE\") or (http.request.uri.query contains \"--\")",
  "action": "block",
  "description": "Block SQL injection patterns"
}
```

**Rule 3: Protect Admin Routes**
```json
{
  "expression": "(http.request.uri.path contains \"/admin\") and (not ip.src in {YOUR_ADMIN_IPS})",
  "action": "challenge",
  "description": "Challenge admin route access"
}
```

#### Step 4: Rate Limiting Rules

**Dashboard Path:** `zerograph.in` → Security → WAF → Rate limiting rules

**Rule 1: Authentication Endpoints (Critical)**
```yaml
Name: Auth Rate Limit
Expression: (http.request.uri.path contains "/auth")
Characteristics: IP
Period: 1 minute
Requests: 10
Action: Block for 10 minutes
Response: 429 Too Many Requests
```

**Rule 2: Edge Functions**
```yaml
Name: Edge Functions Rate Limit
Expression: (http.request.uri.path contains "/functions/v1")
Characteristics: IP
Period: 1 minute  
Requests: 60
Action: Block for 5 minutes
Response: 429 Too Many Requests
```

**Rule 3: Global Rate Limit**
```yaml
Name: Global Rate Limit
Expression: (http.request.uri.path eq "*")
Characteristics: IP
Period: 1 minute
Requests: 300
Action: Challenge
Response: Interactive Challenge
```

**Rule 4: Signup Abuse Prevention**
```yaml
Name: Signup Rate Limit
Expression: (http.request.uri.path contains "/signup") and (http.request.method eq "POST")
Characteristics: IP
Period: 1 hour
Requests: 5
Action: Block for 1 hour
Response: 429 Too Many Requests
```

**Rule 5: API Heavy Endpoints**
```yaml
Name: RAG Chat Rate Limit
Expression: (http.request.uri.path contains "/functions/v1/rag-chat")
Characteristics: IP
Period: 1 minute
Requests: 20
Action: Block for 2 minutes
```

#### Step 5: Bot Management

**Dashboard Path:** `zerograph.in` → Security → Bots

```yaml
Bot Fight Mode: ON
Super Bot Fight Mode (Pro+):
  Definitely Automated: Block
  Likely Automated: Managed Challenge
  Verified Bots: Allow
  Static Resources: Skip (for performance)
  
JavaScript Detections: ON
```

#### Step 6: DDoS Protection

**Dashboard Path:** `zerograph.in` → Security → DDoS

```yaml
HTTP DDoS Attack Protection: ON
  Sensitivity: High
  Action: Block
  
Network-layer DDoS: ON (automatic)

Advanced DDoS Settings:
  - Enable attack analytics
  - Enable attack alerts
```

**Under Attack Mode (Emergency Only):**
```yaml
# Enable via: zerograph.in → Overview → Quick Actions
# This adds a 5-second challenge to ALL visitors
# Use only during active attacks
```

#### Step 7: Firewall Rules for India Focus

**Dashboard Path:** `zerograph.in` → Security → WAF → Custom Rules

**Optional: Geo-based Throttling**
```json
{
  "expression": "(ip.geoip.country ne \"IN\") and (http.request.uri.path contains \"/functions\")",
  "action": "challenge",
  "description": "Challenge non-India API requests"
}
```

**Block Known Bad ASNs:**
```json
{
  "expression": "(ip.geoip.asnum in {AS12345 AS67890})",
  "action": "block",
  "description": "Block known malicious ASNs"
}
```

#### Step 8: Page Rules for Caching & Security

**Dashboard Path:** `zerograph.in` → Rules → Page Rules

**Rule 1: Cache Static Assets**
```yaml
URL: *zerograph.in/assets/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 week
```

**Rule 2: No Cache for Auth**
```yaml
URL: *zerograph.in/auth/*
Settings:
  - Cache Level: Bypass
  - Security Level: High
```

**Rule 3: API Security**
```yaml
URL: *zerograph.in/functions/*
Settings:
  - Cache Level: Bypass
  - Security Level: High
  - Browser Integrity Check: ON
```

---

### 2. Security Headers via Cloudflare Transform Rules

**Dashboard Path:** `zerograph.in` → Rules → Transform Rules → Modify Response Header

**Create Rule: Security Headers**
```yaml
Rule Name: Add Security Headers
When: All incoming requests
Then: Set static headers

Headers to Add:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
  Cross-Origin-Embedder-Policy: credentialless
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
```

**CSP Header (Content-Security-Policy):**
```
default-src 'self'; script-src 'self' 'unsafe-inline' https://ai.gateway.lovable.dev https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ai.gateway.lovable.dev; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

### 3. Cloudflare Workers for Advanced Security

**Dashboard Path:** `zerograph.in` → Workers & Pages → Create Worker

**Worker: Security Headers & Logging**
```javascript
// security-headers-worker.js
export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    
    // Security Headers
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-XSS-Protection', '1; mode=block');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
    newResponse.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    
    // CSP
    newResponse.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://ai.gateway.lovable.dev https://*.supabase.co; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ai.gateway.lovable.dev; " +
      "frame-ancestors 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self'; " +
      "object-src 'none'; " +
      "upgrade-insecure-requests"
    );
    
    // Remove server identification
    newResponse.headers.delete('Server');
    newResponse.headers.delete('X-Powered-By');
    
    return newResponse;
  }
};
```

**Worker: Rate Limiting with IP Tracking**
```javascript
// advanced-rate-limit-worker.js
export default {
  async fetch(request, env, ctx) {
    const ip = request.headers.get('CF-Connecting-IP');
    const path = new URL(request.url).pathname;
    
    // Check if IP is blocked
    const blocked = await env.RATE_LIMIT_KV.get(`blocked:${ip}`);
    if (blocked) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests',
        retry_after: blocked 
      }), { 
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': blocked
        }
      });
    }
    
    // Track request count
    const key = `requests:${ip}:${Math.floor(Date.now() / 60000)}`;
    const count = parseInt(await env.RATE_LIMIT_KV.get(key) || '0') + 1;
    
    // Auth endpoints: 10/min
    if (path.includes('/auth') && count > 10) {
      await env.RATE_LIMIT_KV.put(`blocked:${ip}`, '600', { expirationTtl: 600 });
      return new Response('Rate limited', { status: 429 });
    }
    
    // API endpoints: 60/min
    if (path.includes('/functions') && count > 60) {
      await env.RATE_LIMIT_KV.put(`blocked:${ip}`, '300', { expirationTtl: 300 });
      return new Response('Rate limited', { status: 429 });
    }
    
    await env.RATE_LIMIT_KV.put(key, count.toString(), { expirationTtl: 120 });
    
    return fetch(request);
  }
};
```

**Deploy Worker Route:**
```yaml
Route: *zerograph.in/*
Worker: security-headers-worker
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
- [ ] Verify password strength indicator works
- [ ] Test rate limiting on login/signup

### Cloudflare Configuration
- [ ] Domain added to Cloudflare
- [ ] SSL/TLS set to "Full (strict)"
- [ ] Minimum TLS version set to 1.2
- [ ] TLS 1.3 enabled
- [ ] HSTS enabled (12 months, includeSubDomains, preload)
- [ ] Always Use HTTPS enabled
- [ ] Automatic HTTPS Rewrites enabled

### Cloudflare WAF & Security
- [ ] Cloudflare Managed Ruleset enabled
- [ ] OWASP Core Ruleset enabled (PL2)
- [ ] Custom XSS blocking rule created
- [ ] Custom SQL injection blocking rule created
- [ ] Bot Fight Mode enabled
- [ ] DDoS protection enabled (High sensitivity)

### Cloudflare Rate Limiting
- [ ] Auth endpoints: 10 req/min
- [ ] Edge Functions: 60 req/min
- [ ] Global: 300 req/min
- [ ] Signup: 5 req/hour
- [ ] RAG Chat: 20 req/min

### Cloudflare Headers & Rules
- [ ] Security headers transform rule created
- [ ] CSP header configured
- [ ] Static assets caching enabled
- [ ] Auth routes bypass cache
- [ ] API routes high security level

### Supabase Configuration
- [ ] Enable leaked password protection (Dashboard → Auth → Settings → Security)
- [ ] Verify RLS enabled on all tables
- [ ] Review function search_path settings
- [ ] Enable audit logging
- [ ] Configure backup policies
- [ ] Disable anonymous signups
- [ ] Enable email confirmation

### Post-Deployment Verification
- [ ] Test security headers at [securityheaders.com](https://securityheaders.com/?q=zerograph.in)
- [ ] Test SSL at [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=zerograph.in)
- [ ] Verify CSP doesn't break functionality
- [ ] Test rate limiting behavior manually
- [ ] Monitor error logs for security events
- [ ] Set up Cloudflare alerts for:
  - [ ] DDoS attacks
  - [ ] Rate limit triggers
  - [ ] WAF blocks
  - [ ] SSL errors

### Cloudflare Notifications Setup
**Dashboard Path:** Manage Account → Notifications

Create alerts for:
- [ ] DDoS Attack Alerter
- [ ] Firewall Events Alert
- [ ] Health Checks Notification
- [ ] Security Events Summary (weekly)

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
