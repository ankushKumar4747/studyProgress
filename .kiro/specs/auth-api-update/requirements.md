# Requirements Document

## Introduction

This document specifies the requirements for updating the frontend authentication system to integrate with the new backend login API endpoint. The system currently uses `/auth/login` but needs to be updated to use `/auth/loginUser` with a modified response structure where the token is returned directly in the response body.

## Glossary

- **Frontend Application**: The React-based user interface application located in the frontend directory
- **Authentication Service**: The service module responsible for handling authentication API calls (frontend/services/api.ts)
- **Axios Instance**: The configured HTTP client used for making API requests (frontend/utils/axios.ts)
- **Auth Token**: The JWT (JSON Web Token) returned by the backend for authenticated requests
- **Local Storage**: Browser storage mechanism used to persist the authentication token

## Requirements

### Requirement 1

**User Story:** As a user, I want to log in to the application using my credentials, so that I can access my personalized study tracking features.

#### Acceptance Criteria

1. WHEN a user submits the login form with email and password THEN the Frontend Application SHALL send a POST request to `http://localhost:4000/auth/loginUser`
2. WHEN the login request is sent THEN the Frontend Application SHALL include the email and password in the request body
3. WHEN the backend responds successfully THEN the Frontend Application SHALL extract the token from the response body
4. WHEN a token is received THEN the Frontend Application SHALL store the token in Local Storage with the key 'authToken'
5. WHEN the token is stored successfully THEN the Frontend Application SHALL navigate the user to the dashboard page

### Requirement 2

**User Story:** As a developer, I want the authentication service to use the correct API endpoint, so that the frontend integrates properly with the backend.

#### Acceptance Criteria

1. WHEN the Authentication Service login method is called THEN the system SHALL use the endpoint `/auth/loginUser` instead of `/auth/login`
2. WHEN the API base URL is configured THEN the system SHALL use `http://localhost:4000` as the base URL
3. WHEN the login response is received THEN the system SHALL expect the response format `{ "token": "jwt_string" }`

### Requirement 3

**User Story:** As a user, I want to see appropriate error messages when login fails, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN the login request fails with a network error THEN the Frontend Application SHALL display a user-friendly error message
2. WHEN the login request fails with invalid credentials THEN the Frontend Application SHALL display the error message from the backend response
3. WHEN an error occurs THEN the Frontend Application SHALL maintain the current page state and allow the user to retry

### Requirement 4

**User Story:** As a developer, I want the authentication token to be automatically included in subsequent API requests, so that authenticated endpoints work correctly.

#### Acceptance Criteria

1. WHEN the Auth Token is stored in Local Storage THEN the Axios Instance SHALL retrieve it for subsequent requests
2. WHEN making an authenticated API request THEN the Axios Instance SHALL include the token in the Authorization header as `Bearer {token}`
3. WHEN the token is invalid or expired THEN the Axios Instance SHALL handle 401 responses by clearing the token and redirecting to login
