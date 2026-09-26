# SE4030 Secure Software Development - Assignment

**Group Members Details**

| Name | Index Number | Assigned Role / Service |
| :--- | :--- | :--- |
| Gunasena R.K.R.M.S.K. | IT22125798 | API Security Lead |
| Kaushalya P.L.P.D. | IT22220424 | Restaurant Service |
| Jayasinghe Y.L. | IT22293930 | Order Service |
| Perera K.D.N. | IT22070630 | Delivery Service |



**Original Repository:** [https://github.com/sasmithaK/hands-on-microservices](https://github.com/sasmithaK/hands-on-microservices)

**Fixed Repository:** [https://github.com/sasmithaK/SE4030-ssd-assignment](https://github.com/sasmithaK/SE4030-ssd-assignment)

**YouTube Demo Video:** [https://youtu.be/G8ib7bkPSZQ](https://youtu.be/G8ib7bkPSZQ)


## Project Overview  
This repository contains a full-stack **Food Delivery System** built with a Spring Boot Microservices architecture (Restaurant, Order, and Delivery services) and a React frontend. The application uses MySQL and MongoDB for data persistence and routes API traffic through a Spring Cloud API Gateway.

### High-Level System Architecture

The project follows a distributed microservices pattern:

1. **Frontend Layer:** A React-based web application communicating with the backend via REST APIs.
2. **API Gateway:** Centralized routing and load balancing for incoming client requests.
3. **Microservices Layer:**
   * **Restaurant Service (Port 8082):** Handles menus, restaurants, and user authentication (including Google OAuth2 flow). Uses **MongoDB** for flexible document storage.
   * **Order Service (Port 8083):** Manages customer orders and checkout processes. Uses a relational **MySQL** database.
   * **Delivery Service (Port 8084):** Manages driver registrations, profiles, and deliveries. Uses a relational **MySQL** database.
4. **Security Layer:** Stateless JWT tokens for intra-service authentication, hardened with `HttpOnly` cookies and Google OAuth2 for administration endpoints.

```mermaid
graph TD
    Client[React Frontend] -->|REST / HttpOnly Cookies| Gateway[API Gateway]
    
    Gateway -->|JWT Auth| Auth[Restaurant Service]
    Gateway -->|JWT Auth| Order[Order Service]
    Gateway -->|JWT Auth| Delivery[Delivery Service]
    
    Auth -->|NoSQL| Mongo[(MongoDB Atlas / Local)]
    Order -->|SQL| MySQL[(MySQL Database)]
    Delivery -->|SQL| MySQL
    
    Google[Google OAuth2] -.->|SSO Callback| Auth
```


## Assignment Goal (SE4030)
The objective of this assignment is to identify and remediate security vulnerabilities in an existing application. In this project, we:
1. Conducted SAST and DAST security audits using tools like OWASP ZAP, SonarQube, and TruffleHog.
2. Identified **9 distinct vulnerabilities** across 6 OWASP Top 10 categories (exceeding the requirement of 7).
3. Successfully patched all vulnerabilities in the source code.
4. Implemented a mandatory **OAuth2 / OpenID Connect** feature by securing the Restaurant Admin login portal via Google OAuth2 with secure HttpOnly cookies.


## Tools Used for Security Auditing
We utilized a combination of dynamic analysis (DAST), static analysis (SAST), and AI-driven code reviews to thoroughly audit the application:
* **OWASP ZAP:** Used for dynamic application security testing (DAST), intercepting API requests, and fuzzing payloads to uncover broken access control and injection flaws.
* **GitHub Code Scanning (CodeQL):** Leveraged for static application security testing (SAST) to detect issues like Browser Storage Poisoning and configuration weaknesses.
* **SonarQube Cloud:** Used for continuous inspection of code quality, detecting hardcoded secrets, and flagging insecure security configurations (e.g., disabled CSRF).
* **CodeRabbit AI:** Utilized for AI-powered pull request reviews to catch logic flaws, review security patches, and ensure secure coding best practices during merges.
* **TruffleHog:** Scanned the Git commit history to unearth hidden secrets and leaked database credentials.

---



## Part 1: Vulnerability Findings and Fixes

### V1: Hardcoded JWT Secret Key (A02: Cryptographic Failures)
* **Identification Tool:** SonarQube (SAST) / Manual Git Log
* **Vulnerability:** The JWT signing key was hardcoded in plain text in JwtUtils.java, allowing anyone to forge valid admin tokens.
* **Fix:** Removed the hardcoded string and injected the secret via environment variables (`@Value("${jwt.secret}")`).

### V2: Exposed MongoDB Credentials (A02: Cryptographic Failures)
* **Identification Tool:** TruffleHog (Secret Scanner)
* **Vulnerability:** Live MongoDB Atlas connection string (with username and password) was hardcoded in application.properties.
* **Fix:** Replaced the hardcoded URI with the `SPRING_DATA_MONGODB_URI` environment variable.

### V3: Plaintext Passwords in Database (A02: Cryptographic Failures)
* **Identification Tool:** Manual Database Inspection (MySQL Query)
* **Vulnerability:** Customer passwords were being stored in the database without any encryption or hashing.
* **Fix:** Implemented `BCryptPasswordEncoder` to hash passwords before saving them, and used `.matches()` for secure login verification.

### V4: Broken Access Control (A01: Broken Access Control)
* **Identification Tool:** OWASP ZAP (DAST) - Active Scan / Spider
* **Vulnerability:** Admin endpoints in the Restaurant Service lacked role-based access checks, allowing any regular customer to access admin APIs.
* **Fix:** Enabled `@EnableMethodSecurity` and added `@PreAuthorize("hasRole('RESTAURANT_ADMIN')")` to all admin endpoints.

### V5: CORS Wildcard and IDOR (A01: Broken Access Control / A05: Security Misconfiguration)
* **Identification Tool:** Browser DevTools / OWASP ZAP
* **Vulnerability:** The Delivery Service had a wildcard CORS and lacked ownership checks, allowing any user to update another driver's profile.
* **Fix:** Removed the wildcard CORS and added explicit validation using `SecurityContextHolder` to ensure the logged-in email matches the profile being edited.

### V6: Missing Input Validation (A03: Injection)
* **Identification Tool:** OWASP ZAP (Fuzzing / Active Scan)
* **Vulnerability:** DTOs lacked bean validation, allowing empty or malformed data to reach the database and potentially cause NoSQL/SQL injection.
* **Fix:** Added `@Valid`, `@NotBlank`, and `@Size` annotations to all DTOs and Controller endpoints across all services.

### V7: Sensitive Data in API Responses and LocalStorage (A02 / A07)
* **Identification Tool:** OWASP ZAP / CodeQL (Browser Storage Poisoning)
* **Vulnerability:** The API returned raw passwords in JSON responses, and frontend clients stored sensitive JWTs and user data in localStorage (vulnerable to XSS).
* **Fix:** Excluded passwords from DTO responses. Relocated JWT storage from localStorage to secure, `HttpOnly` cookies.

### V8: Unauthenticated MongoDB Exposed on Public Port (A05: Security Misconfiguration)
* **Identification Tool:** mongosh / Nmap
* **Vulnerability:** The MongoDB container in docker-compose.yaml had no root username/password set and exposed port 27017 directly to the host.
* **Fix:** Added `MONGO_INITDB_ROOT_USERNAME` and `PASSWORD` environment variables to enforce database authentication.

### V9: Insufficient Security Logging (A09: Security Logging Failures)
* **Identification Tool:** Manual Code Review / SonarQube
* **Vulnerability:** Missing structured logging for security events (login failures, etc.), and sensitive financial transactions were printed using `System.out.println()`.
* **Fix:** Replaced standard output with `@Slf4j` secure logging (`log.info()`, `log.warn()`) across all relevant service controllers and global exception handlers.

---

## Part 2: OAuth2 / OIDC Implementation
To secure the Restaurant Admin login portal, we implemented a robust **Google OAuth2** flow (Authorization Code + PKCE).

* **Backend Integration:** Configured `SecurityConfig.java` to support `.oauth2Login()`.
* **Secure Token Handling:** Instead of exposing the resulting JWT in the URL or storing it in the frontend's localStorage, the `OAuth2LoginSuccessHandler` securely drops the JWT into an `HttpOnly` cookie.
* **Frontend:** Updated Axios interceptors with `withCredentials: true` to seamlessly pass the secure cookie back to the microservices.


---

## How to Run the Project

### 1. Prerequisites
* **Docker & Docker Compose** (for running the backend services and databases)
* **Node.js (v16+) & npm** (for running the React frontend)
* **Java 17+** (if compiling backend manually, though Docker handles it)

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Copy the `.env.example` file to a new file named `.env` and fill in your actual **Google OAuth2 Credentials** (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) and your **MongoDB Atlas URI** (`MONGODB_URI`).
3. Start the backend services using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
   *(This will spin up the MySQL database, MongoDB, API Gateway, and the Restaurant, Order, and Delivery microservices).*

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Access the web application at `http://localhost:3000`.

---

## API Endpoints Overview

The backend is composed of multiple microservices. Requests can be routed through the API Gateway or accessed directly via their respective ports during development.

### Restaurant & Admin Service (Port 8082)
* **`POST /api/auth/signup`** - Register a new user (Customer, Delivery Person, or Admin)
* **`POST /api/auth/login`** - Traditional JWT login
* **`GET /login/oauth2/code/google`** - OAuth2 Google Login Callback (Sets secure HttpOnly Cookie)
* **`GET /api/restaurants`** - Fetch all restaurants
* **`POST /api/restaurants/{id}/menu`** - Add a menu item (Secured)
* **`GET /api/admin/users`** - List all users (Requires `RESTAURANT_ADMIN` role)

### Order Service (Port 8083)
* **`POST /api/customers/register`** - Register a customer account
* **`POST /api/customers/login`** - Customer login
* **`POST /api/orders`** - Create a new food order
* **`GET /api/orders/customer/{id}`** - Fetch order history (Secured via ownership check)

### Delivery Service (Port 8084)
* **`POST /api/driver/register`** - Register a delivery driver
* **`POST /api/driver/login`** - Driver login
* **`GET /api/driver/{id}`** - Fetch driver profile
* **`PUT /api/driver/{id}`** - Update driver profile (Secured via ownership check)
