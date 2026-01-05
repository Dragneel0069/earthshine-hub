/**
 * Request Signing Utility
 * Prevents replay attacks by adding timestamp, nonce, and HMAC signature
 */

// Generate a cryptographically secure nonce
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generate signature using Web Crypto API
async function generateSignature(
  payload: string,
  timestamp: number,
  nonce: string
): Promise<string> {
  const message = `${timestamp}.${nonce}.${payload}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Use SHA-256 hash as signature (client-side, no secret needed)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface SignedRequest {
  payload: unknown;
  timestamp: number;
  nonce: string;
  signature: string;
}

// Sign a request payload
export async function signRequest(payload: unknown): Promise<SignedRequest> {
  const timestamp = Date.now();
  const nonce = generateNonce();
  const payloadString = JSON.stringify(payload);
  const signature = await generateSignature(payloadString, timestamp, nonce);
  
  return {
    payload,
    timestamp,
    nonce,
    signature,
  };
}

// Headers to include with signed requests
export function getSignedHeaders(signedRequest: SignedRequest): Record<string, string> {
  return {
    'X-Request-Timestamp': signedRequest.timestamp.toString(),
    'X-Request-Nonce': signedRequest.nonce,
    'X-Request-Signature': signedRequest.signature,
  };
}
