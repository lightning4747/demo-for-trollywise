# TrollyWise Demo App — Requirements Document

**Scope:** Client Portal (Auth, Dashboard, Demo Booking, Payment)
**Excludes:** Landing page (separate owner), 3D model, admin panel
**Purpose:** Investor-facing demo. Not a production system — no real fulfillment, no post-demo lifecycle, no inventory tracking.

---

## 1. Functional Requirements (FR)

### 1.1 Authentication

| ID | Requirement | Description |
|---|---|---|
| FR-1.1 | User Signup | User creates an account with name, email, password. Email must be unique. Password stored as a bcrypt hash — never plaintext. |
| FR-1.2 | User Login | User logs in with email + password. On success, issue a JWT (httpOnly cookie). On failure, return a generic "invalid credentials" error (no user-enumeration hints). |
| FR-1.3 | Session Persistence | JWT persists the session across page reloads until expiry or logout. |
| FR-1.4 | Logout | User can log out, which clears the session/cookie. |
| FR-1.5 | Route Protection | Dashboard, booking form, and payment pages are inaccessible without a valid session; unauthenticated users are redirected to login. |
| FR-1.6 | Single Role | Only one role exists: "client." No admin, staff, or approval role in this build. |

### 1.2 Client Dashboard

| ID | Requirement | Description |
|---|---|---|
| FR-2.1 | View Past Requests | After login, client sees a table/list of their own demo requests: business name, date requested, status (`pending_payment` / `confirmed`). |
| FR-2.2 | Empty State | If the client has no requests yet, show a clear empty state with a prompt to book a demo. |
| FR-2.3 | Request a Demo | A visible "Request a Demo" button/CTA navigates to the booking form. |
| FR-2.4 | Data Scoping | A client can only ever see their own requests, never another user's. |

### 1.3 Demo Booking Form

| ID | Requirement | Description |
|---|---|---|
| FR-3.1 | Form Fields | Collect: name, business name, store address, phone number. (Optional: store type/size if desired later.) |
| FR-3.2 | Client-Side Validation | Required fields enforced; phone format and non-empty checks before submit. |
| FR-3.3 | Server-Side Validation | Backend re-validates all fields regardless of frontend checks — never trust client input. |
| FR-3.4 | Request Creation | On valid submit, create a `demo_requests` row tied to the logged-in `user_id`, status `pending_payment`. |
| FR-3.5 | Redirect to Payment | On successful form creation, user is taken directly to the payment step for that request. |

### 1.4 Payment (Razorpay — Test Mode)

| ID | Requirement | Description |
|---|---|---|
| FR-4.1 | Fixed Amount | Payment amount is fixed at ₹25,000 for the 15-day demo period. Amount is set server-side, never trusted from the frontend. |
| FR-4.2 | Order Creation | Backend creates a Razorpay order (test mode) for the pending request before checkout opens. |
| FR-4.3 | Checkout | Frontend opens Razorpay Checkout using the order ID from the backend. |
| FR-4.4 | Payment Verification | On payment completion, backend verifies the Razorpay signature server-side before marking anything as paid. |
| FR-4.5 | Status Update | On verified success, update the `demo_requests` row: status → `confirmed`, store `razorpay_payment_id` and `razorpay_order_id`. |
| FR-4.6 | Failure Handling | On payment failure/cancellation, request remains `pending_payment` and the user can retry. |
| FR-4.7 | Test-Mode Only | Only Razorpay test API keys are used. No real money moves in this build. |

### 1.5 Confirmation & Notification

| ID | Requirement | Description |
|---|---|---|
| FR-5.1 | In-App Confirmation | On confirmed payment, show a success screen summarizing the booking (business name, address, amount, demo duration). |
| FR-5.2 | Email Confirmation | Trigger a confirmation email via Resend to the client's registered email, containing booking details. |
| FR-5.3 | Dashboard Reflects Status | The new request appears in the dashboard list with status `confirmed` immediately after payment. |

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Security

| ID | Requirement | Description |
|---|---|---|
| NFR-1.1 | Password Hashing | All passwords hashed with bcrypt (or argon2), salted, never logged or stored in plaintext. |
| NFR-1.2 | JWT Handling | JWT stored in an httpOnly, secure cookie — not localStorage — to reduce XSS token theft risk. |
| NFR-1.3 | Server-Side Trust Boundary | All pricing, order amounts, and payment verification happen server-side. Frontend values are treated as untrusted input. |
| NFR-1.4 | Payment Signature Verification | Razorpay webhook/callback signature is cryptographically verified before any status change — prevents forged "payment success" calls. |
| NFR-1.5 | Input Sanitization | All form inputs sanitized/validated on the backend to prevent injection (SQL injection, XSS via stored data). |
| NFR-1.6 | Environment Secrets | API keys (Razorpay, Resend, DB credentials, JWT secret) stored in environment variables, never committed to source control. |
| NFR-1.7 | HTTPS Only | All traffic served over HTTPS in deployed environments (Vercel/Render enforce this by default). |
| NFR-1.8 | CORS Policy | Backend API restricts CORS to the known frontend origin only. |

### 2.2 Performance

| ID | Requirement | Description |
|---|---|---|
| NFR-2.1 | Page Load | Dashboard and booking form should load within ~2 seconds on a standard broadband connection — acceptable for an investor demo, not a hard SLA. |
| NFR-2.2 | Payment Responsiveness | Razorpay checkout modal should open within 1–2 seconds of clicking "Pay." |

### 2.3 Reliability

| ID | Requirement | Description |
|---|---|---|
| NFR-3.1 | Idempotent Payment Handling | Duplicate payment confirmation callbacks must not create duplicate confirmed records or double-trigger emails. |
| NFR-3.2 | Graceful Error States | Network/API failures show a user-facing error message, not a blank screen or unhandled crash. |
| NFR-3.3 | Email Delivery Tolerance | If the email service fails, the booking must still be marked `confirmed` in the database — email is a notification, not a transaction gate. |

### 2.4 Usability

| ID | Requirement | Description |
|---|---|---|
| NFR-4.1 | Clear Form Feedback | Validation errors are shown inline, next to the relevant field, in plain language. |
| NFR-4.2 | Status Legibility | Request statuses (`pending_payment`, `confirmed`) are shown with clear visual distinction (e.g., color/badge), not just raw text. |
| NFR-4.3 | Mobile Responsiveness | Dashboard, form, and payment flow are usable on mobile viewports, since investors may view on a phone/tablet. |

### 2.5 Maintainability

| ID | Requirement | Description |
|---|---|---|
| NFR-5.1 | TypeScript Everywhere | All React and Node code written in TypeScript with explicit types — no implicit `any`. |
| NFR-5.2 | Code Structure | Clear separation of concerns: routes, controllers, services, DB access layer on the backend; components/pages/hooks on the frontend. |
| NFR-5.3 | Environment Config | Single `.env`-driven config for local vs. deployed environments (dev/prod DB URLs, API keys). |

### 2.6 Deployment

| ID | Requirement | Description |
|---|---|---|
| NFR-6.1 | Frontend Hosting | React app deployed on Vercel. |
| NFR-6.2 | Backend Hosting | Node/Express API deployed on Render or Railway. |
| NFR-6.3 | Database | PostgreSQL, managed instance (Render/Railway/Supabase — any is acceptable for demo scale). |
| NFR-6.4 | Zero-Downtime Not Required | Given this is a demo, brief redeploy downtime is acceptable; no blue-green deployment needed. |

### 2.7 Scope Boundaries (Explicit Non-Requirements)

| ID | Note |
|---|---|
| OUT-1 | No inventory/availability tracking for trolly units. |
| OUT-2 | No post-15-day lifecycle (no auto-expiry logic, no renewal, no return flow). |
| OUT-3 | No admin/internal dashboard to view all client requests across users. |
| OUT-4 | No maintenance/support plans — product not yet sold. |
| OUT-5 | No real payment processing — Razorpay test mode only. |
| OUT-6 | No multi-role access control beyond the single "client" role. |

---

## 3. Data Model (Reference)

```sql
users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  email         VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

demo_requests (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER REFERENCES users(id),
  business_name       VARCHAR NOT NULL,
  store_address       TEXT NOT NULL,
  phone               VARCHAR NOT NULL,
  status              VARCHAR NOT NULL DEFAULT 'pending_payment', -- pending_payment | confirmed
  razorpay_order_id   VARCHAR,
  razorpay_payment_id VARCHAR,
  created_at          TIMESTAMP DEFAULT NOW()
);
```