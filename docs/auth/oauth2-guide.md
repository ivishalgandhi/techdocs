---
sidebar_position: 10
title: "OAuth 2.0: Authorization Framework"
description: "A comprehensive guide to OAuth 2.0, the industry-standard protocol for authorization"
---

# OAuth 2.0: Authorization Framework

OAuth 2.0 is the industry-standard protocol for authorization. Unlike authentication protocols that verify identity, OAuth 2.0 focuses on delegation of access rights, allowing third-party applications to access resources on behalf of users without exposing credentials.

## Core Concepts

At its foundation, OAuth 2.0 involves several key actors:

- **Resource Owner**: The entity (typically the end-user) that can grant access to a protected resource
- **Client**: The application requesting access to protected resources
- **Authorization Server**: The server that authenticates the Resource Owner and issues access tokens
- **Resource Server**: The server hosting the protected resources, capable of accepting and responding to requests using access tokens

```mermaid
sequenceDiagram
    participant User as Resource Owner
    participant App as Client
    participant Auth as Authorization Server
    participant API as Resource Server
    
    User->>App: Use Application
    App->>Auth: Authorization Request
    Auth->>User: Authentication & Authorization
    User->>Auth: Consent
    Auth->>App: Authorization Code
    App->>Auth: Token Request (with Auth Code)
    Auth->>App: Access Token
    App->>API: API Request with Access Token
    API->>App: Protected Resource
```

## Authorization Grant Types

OAuth 2.0 defines four primary authorization grant types, each suited to different use cases:

### 1. Authorization Code Flow

Best for server-side applications. This is the most common and secure flow.

```mermaid
flowchart LR
    A[User] --> B[Client App]
    B --> C[Auth Server]
    C --> D[Authorization Code]
    D --> E[Exchange for Token]
    E --> F[Access Resource]
```

**Implementation details**:
- User is redirected to the authorization server
- After authentication, authorization server redirects back to client with an authorization code
- Client exchanges code for an access token using its client secret
- Client uses the access token to access resources

### 2. Implicit Flow

Designed for browser-based applications or mobile apps without a backend server (now largely deprecated in favor of Authorization Code Flow with PKCE).

```mermaid
flowchart LR
    A[User] --> B[Client App]
    B --> C[Auth Server]
    C --> D[Access Token]
    D --> E[Access Resource]
```

**Security note**: This flow returns the access token directly in the browser redirect, making it more vulnerable to token leakage.

### 3. Resource Owner Password Credentials

Used when there is a high degree of trust between the user and the client application. The application collects the user's credentials directly.

```mermaid
flowchart LR
    A[Client App] --> B[Collect Username/Password]
    B --> C[Exchange for Token]
    C --> D[Access Resource]
```

**Security note**: This grant type should be avoided when possible as it requires the client to collect the user's credentials directly.

### 4. Client Credentials

Used for server-to-server authentication where no user is involved.

```mermaid
flowchart LR
    A[Server App] --> B[Auth Server]
    B --> C[Access Token]
    C --> D[Access Resource]
```

**Implementation details**:
- Client authenticates with its client ID and secret
- No user interaction required
- Used for accessing resources owned by the client itself

## OAuth 2.0 Tokens

### Access Tokens

The primary credential used to access protected resources. Key characteristics:

- Typically short-lived (minutes to hours)
- Can be any format (though JWT is common)
- Sent with each API request, usually as a Bearer token in the Authorization header

Example usage:
```http
GET /api/resource HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refresh Tokens

Used to obtain new access tokens when the original expires:

- Typically long-lived (days to months)
- Should be stored securely
- Never sent to resource servers
- Can be revoked to terminate access

## Token Validation

Resource servers must validate tokens before granting access to protected resources. Two common approaches:

### 1. Local Validation

If tokens are JWTs with signatures:
```javascript
// Pseudocode for JWT validation
function validateToken(token) {
  const decoded = decodeJWT(token);
  if (!verifySignature(decoded, publicKey)) return false;
  if (isExpired(decoded.exp)) return false;
  if (decoded.aud !== 'my-api') return false;
  return true;
}
```

### 2. Introspection Endpoint

For opaque tokens or additional validation:
```http
POST /introspect HTTP/1.1
Host: auth-server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=mF_9.B5f-4.1JqM&token_type_hint=access_token
```

Response:
```json
{
  "active": true,
  "client_id": "l238j323ds-23ij4",
  "username": "jsmith",
  "scope": "read write",
  "sub": "Z5O3upPC88QrAjx00dis",
  "exp": 1419356238
}
```

## OAuth 2.0 Scopes

Scopes limit the authorization to specific resources or actions:

- Defined by the resource server
- Requested by the client during authorization
- User consents to specific scopes
- Included in the access token

Example scopes:
```
read:contacts write:contacts read:profile admin:settings
```

## Security Best Practices

### PKCE (Proof Key for Code Exchange)

PKCE enhances security for public clients by preventing authorization code interception attacks:

1. Client generates a random `code_verifier`
2. Client derives a `code_challenge` from the verifier (typically using SHA-256)
3. Authorization request includes the `code_challenge`
4. Token request includes the original `code_verifier` for verification

```javascript
// Generate code_verifier and code_challenge
const codeVerifier = generateRandomString(64);
const codeChallenge = base64UrlEncode(sha256(codeVerifier));

// Authorization request
// GET /authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&code_challenge=CODE_CHALLENGE&code_challenge_method=S256

// Token request
// POST /token
// code=AUTH_CODE&client_id=CLIENT_ID&code_verifier=CODE_VERIFIER&grant_type=authorization_code
```

### State Parameter

The `state` parameter helps prevent CSRF attacks:

```javascript
// Authorization request
const state = generateRandomString(32);
// Store state in session
sessionStorage.setItem('oauth_state', state);

// GET /authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&state=STATE

// Verify state in callback
if (receivedState !== sessionStorage.getItem('oauth_state')) {
  // Potential CSRF attack
  throw new Error('Invalid state parameter');
}
```

## Common OAuth 2.0 Extensions

### OpenID Connect (OIDC)

OIDC is built on top of OAuth 2.0, adding authentication capabilities:

- Standardized identity tokens (JWT format)
- UserInfo endpoint for profile information
- Standard claims about the authenticated user
- Discovery and registration protocols

### Token Introspection (RFC 7662)

Allows resource servers to validate tokens with the authorization server:

```http
POST /introspect HTTP/1.1
Host: auth-server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=mF_9.B5f-4.1JqM&token_type_hint=access_token
```

### Token Revocation (RFC 7009)

Enables clients to signal the authorization server that a token is no longer needed:

```http
POST /revoke HTTP/1.1
Host: auth-server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=45ghiukldjahdnhzdauz&token_type_hint=refresh_token
```

### OAuth 2.0 for Native Apps (RFC 8252)

Provides guidelines for implementing OAuth in native applications:

- Use system browser for authorization requests
- Use HTTPS redirect URIs with custom schemes
- Implement PKCE
- Securely store tokens

## OAuth 2.0 Implementation Examples

### Client Authorization Request (Authorization Code Flow)

```javascript
// Redirect user to authorization endpoint
function redirectToAuth() {
  const authUrl = new URL('https://auth-server.example.com/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', 'YOUR_CLIENT_ID');
  authUrl.searchParams.append('redirect_uri', 'https://your-app.com/callback');
  authUrl.searchParams.append('scope', 'read write');
  authUrl.searchParams.append('state', generateRandomState());
  
  // Add PKCE parameters
  const codeVerifier = generateCodeVerifier();
  sessionStorage.setItem('code_verifier', codeVerifier);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  
  window.location.href = authUrl.toString();
}
```

### Token Exchange

```javascript
// Exchange authorization code for tokens
async function exchangeCodeForToken(code) {
  const tokenUrl = 'https://auth-server.example.com/token';
  const codeVerifier = sessionStorage.getItem('code_verifier');
  
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://your-app.com/callback');
  params.append('client_id', 'YOUR_CLIENT_ID');
  params.append('client_secret', 'YOUR_CLIENT_SECRET');
  params.append('code_verifier', codeVerifier);
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  const tokens = await response.json();
  // Store tokens securely
  sessionStorage.setItem('access_token', tokens.access_token);
  sessionStorage.setItem('refresh_token', tokens.refresh_token);
  return tokens;
}
```

### Making Authenticated API Requests

```javascript
// Use access token to call protected API
async function callProtectedApi() {
  const accessToken = sessionStorage.getItem('access_token');
  const apiUrl = 'https://api.example.com/protected-resource';
  
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    await refreshAccessToken();
    return callProtectedApi();
  }
  
  return response.json();
}
```

### Refreshing Access Tokens

```javascript
// Refresh the access token using a refresh token
async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refresh_token');
  const tokenUrl = 'https://auth-server.example.com/token';
  
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', 'YOUR_CLIENT_ID');
  params.append('client_secret', 'YOUR_CLIENT_SECRET');
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  const tokens = await response.json();
  sessionStorage.setItem('access_token', tokens.access_token);
  
  // Some servers also return a new refresh token
  if (tokens.refresh_token) {
    sessionStorage.setItem('refresh_token', tokens.refresh_token);
  }
  
  return tokens;
}
```

## Advantages of OAuth 2.0

1. **Delegation without credential sharing**: Users don't need to share their credentials with third-party applications
2. **Limited access**: Scopes restrict what actions third-party applications can perform
3. **Revocable access**: Tokens can be revoked without changing user credentials
4. **Time-limited authorization**: Access tokens expire automatically
5. **Widely adopted**: Industry standard supported by major providers
6. **Extensible**: Framework for building additional security protocols (like OpenID Connect)

## Common Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Token storage in browser applications | Use HttpOnly cookies or secure web storage with proper CSRF protection |
| Mobile app security | Follow RFC 8252, use PKCE, avoid WebViews |
| Cross-Origin Resource Sharing (CORS) | Configure proper CORS policies on resource servers |
| Token validation | Use introspection endpoint or JWT validation |
| Service-to-service authentication | Use client credentials flow with proper client authentication |

## OAuth 2.0 vs OAuth 1.0a

| Feature | OAuth 2.0 | OAuth 1.0a |
|---------|-----------|------------|
| Complexity | Simpler | More complex |
| Token format | Flexible (often JWT) | Opaque string |
| Signature | Not required (TLS) | Required cryptographic signature |
| Client types | Multiple flows for different clients | One flow for all clients |
| Security | Relies on TLS | Cryptographic signatures |
| Bearer tokens | Yes | No |
| Token expiration | Built-in | Not defined |

## Summary

OAuth 2.0 is a flexible, widely-adopted framework for authorization that enables secure delegation of access to protected resources. Its modular design allows for various client types and security requirements through different grant types and extensions. By focusing on authorization rather than authentication, OAuth 2.0 solves the specific problem of controlled access delegation without credential sharing.

While OAuth 2.0 itself doesn't provide authentication, its extension OpenID Connect adds standardized identity functionality. Together, these protocols form the foundation of modern API security and single sign-on systems across the web.

## Further Reading

- [OAuth 2.0 Specification (RFC 6749)](https://tools.ietf.org/html/rfc6749)
- [OAuth 2.0 Bearer Token Usage (RFC 6750)](https://tools.ietf.org/html/rfc6750)
- [OAuth 2.0 Threat Model and Security Considerations (RFC 6819)](https://tools.ietf.org/html/rfc6819)
- [OAuth 2.0 for Native Apps (RFC 8252)](https://tools.ietf.org/html/rfc8252)
- [Proof Key for Code Exchange (RFC 7636)](https://tools.ietf.org/html/rfc7636)
- [OAuth 2.0 Token Introspection (RFC 7662)](https://tools.ietf.org/html/rfc7662)
- [OAuth.net Official Website](https://oauth.net/2/)
