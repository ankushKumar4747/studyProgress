# Design Document

## Overview

This design document outlines the approach for updating the frontend authentication system to integrate with the new backend login API endpoint at `http://localhost:4000/auth/loginUser`. The update involves modifying the API service layer, updating the base URL configuration, and ensuring proper token handling throughout the application.

## Architecture

The authentication flow follows a standard client-server architecture:

1. **Presentation Layer** (Login.tsx): Handles user input and displays feedback
2. **Service Layer** (api.ts): Manages API communication and data transformation
3. **HTTP Client Layer** (axios.ts): Handles HTTP requests, interceptors, and token management
4. **Storage Layer** (localStorage): Persists authentication tokens

The flow is unidirectional: User Input → Service Call → HTTP Request → Token Storage → Navigation

## Components and Interfaces

### 1. Authentication Service (frontend/services/api.ts)

**Current Interface:**
```typescript
authAPI.login(email: string, password: string): Promise<{ token: string }>
```

**Updates Required:**
- Change endpoint from `/auth/login` to `/auth/loginUser`
- Maintain the same interface contract for backward compatibility

### 2. Axios Instance (frontend/utils/axios.ts)

**Current Configuration:**
```typescript
baseURL: 'http://localhost:3000/api'
```

**Updates Required:**
- Update base URL to `http://localhost:4000`
- Remove `/api` prefix as the backend endpoint is `/auth/loginUser` (not `/api/auth/loginUser`)

**Interceptor Behavior:**
- Request interceptor: Adds `Authorization: Bearer {token}` header from localStorage
- Response interceptor: Handles 401 errors by clearing token and redirecting to login

### 3. Login Component (frontend/pages/Login.tsx)

**Current Behavior:**
- Calls `authAPI.login(email, password)`
- Stores `response.token` in localStorage
- Navigates to `/dashboard` on success

**Updates Required:**
- No changes needed (interface remains the same)

## Data Models

### Login Request
```typescript
{
  email: string;
  password: string;
}
```

### Login Response
```typescript
{
  token: string; // JWT token
}
```

### Stored Token
```typescript
localStorage.setItem('authToken', token: string)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Login endpoint correctness
*For any* login attempt with valid credentials, the authentication service should send a POST request to the exact endpoint `/auth/loginUser` at base URL `http://localhost:4000`
**Validates: Requirements 2.1**

### Property 2: Token storage consistency
*For any* successful login response containing a token, the token should be stored in localStorage with the key 'authToken' and should be retrievable immediately after storage
**Validates: Requirements 1.4**

### Property 3: Authorization header inclusion
*For any* API request made after successful login, the Axios instance should include an Authorization header with the format `Bearer {token}` where token matches the value stored in localStorage
**Validates: Requirements 4.2**

### Property 4: Error state preservation
*For any* failed login attempt, the login form state (email and password fields) should remain unchanged, allowing the user to retry without re-entering credentials
**Validates: Requirements 3.3**

## Error Handling

### Network Errors
- **Scenario**: Backend server is unreachable
- **Handling**: Display generic error message "Login failed. Please try again."
- **User Action**: Retry login

### Authentication Errors (401)
- **Scenario**: Invalid credentials provided
- **Handling**: Display error message from backend response
- **User Action**: Correct credentials and retry

### Token Expiration (401 on subsequent requests)
- **Scenario**: Token expires during session
- **Handling**: Axios interceptor clears token and redirects to login
- **User Action**: Re-authenticate

### Validation Errors
- **Scenario**: Empty email or password fields
- **Handling**: HTML5 form validation prevents submission
- **User Action**: Fill required fields

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and integration points:

1. **Authentication Service Tests**
   - Test that login method calls correct endpoint
   - Test that response token is returned correctly
   - Test error handling for network failures

2. **Axios Configuration Tests**
   - Test that base URL is set correctly
   - Test that Authorization header is added when token exists
   - Test that 401 responses trigger logout flow

3. **Login Component Tests**
   - Test successful login flow stores token
   - Test successful login navigates to dashboard
   - Test error messages display correctly

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript/TypeScript property-based testing library):

1. **Property 1: Login endpoint correctness**
   - Generate random valid email/password combinations
   - Verify all requests go to `http://localhost:4000/auth/loginUser`
   - Run 100 iterations

2. **Property 2: Token storage consistency**
   - Generate random JWT-like token strings
   - Store each token and immediately retrieve it
   - Verify stored value matches original for all tokens
   - Run 100 iterations

3. **Property 3: Authorization header inclusion**
   - Generate random token strings
   - Store token in localStorage
   - Make API request and verify Authorization header format
   - Run 100 iterations

4. **Property 4: Error state preservation**
   - Generate random email/password combinations
   - Simulate login failure
   - Verify form state remains unchanged
   - Run 100 iterations

**Testing Configuration:**
- Library: fast-check
- Minimum iterations per property: 100
- Each property test must reference its design document property using format: `**Feature: auth-api-update, Property {number}: {property_text}**`

### Integration Tests

Integration tests will verify the complete authentication flow:

1. **End-to-End Login Flow**
   - Submit login form with valid credentials
   - Verify API call is made to correct endpoint
   - Verify token is stored in localStorage
   - Verify navigation to dashboard occurs

2. **Token Persistence Flow**
   - Login successfully
   - Make authenticated API request
   - Verify token is included in request headers

## Implementation Notes

### Configuration Changes

The base URL should be configurable via environment variables:

```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
```

Update `.env.local`:
```
VITE_API_BASE_URL=http://localhost:4000
```

### Backward Compatibility

The authentication service interface remains unchanged, ensuring no breaking changes for components that depend on it.

### Security Considerations

1. Token stored in localStorage (acceptable for this use case)
2. HTTPS should be used in production
3. Token should have reasonable expiration time
4. Sensitive data should not be logged in production

## Dependencies

- axios: ^1.x (existing)
- react-router-dom: ^6.x (existing)
- fast-check: ^3.x (to be added for property-based testing)
