# AgriLink Ethiopia – Usability & Functional QA Report (v1.0)

- Prepared for: AgriLink Ethiopia
- Prepared by: Abenezer Abebe
- Date: [Insert date]
- Scope: End-to-end QA against SDS, including functional flows, usability, accessibility, performance (3G), PWA/offline behaviors, i18n, payments/escrow, API contracts, security, and observability.
- Basis: Codebase and SDS you provided (no live environment). Static analysis + executable test plans. Empirical metrics to be added once environment access is shared.

## Table of Contents

- 1. Executive Summary
- 2. Objectives and Scope
- 3. Test Environment and Dependencies
- 4. Methodology
- 5. Architecture and Stack Overview
- 6. Feature Coverage and Functional Results
  - 6.1 Authentication and OTP
  - 6.2 Listings/Products
  - 6.3 Orders and Escrow/Payments
  - 6.4 Chat and Notifications
  - 6.5 Admin
- 7. Usability Evaluation (Mobile-First)
- 8. Accessibility (WCAG 2.1 AA)
- 9. Performance (3G), Bundles, and Caching
- 10. PWA and Offline-First
- 11. Internationalization (i18n)
- 12. Security and Compliance
- 13. API Documentation and Contracts
- 14. Observability and DevOps
- 15. Defect Log (Prioritized)
- 16. Recommendations and Roadmap
- 17. Conclusion
- Appendices
  - A. Endpoint Groups (by Feature Area)
  - B. Data Model Summary
  - C. Device Matrix and Tooling
  - D. Detailed Test Cases Catalog
  - E. Evidence Placeholders (Screenshots)
  - F. References

## List of Figures

- Figure 1. Backend Health Check Response – ![Figure 1 – Backend Health Check](docs/report_assets/fig-01.svg)
- Figure 2. Login/OTP Flow – ![Figure 2 – Login/OTP Flow](docs/report_assets/fig-02.svg)
- Figure 3. Create Listing (Online) – ![Figure 3 – Create Listing (Online)](docs/report_assets/fig-03.svg)
- Figure 4. Create Listing (Offline Draft) – ![Figure 4 – Create Listing (Offline Draft)](docs/report_assets/fig-04.svg)
- Figure 5. Orders: Buyer-to-Farmer Flow – ![Figure 5 – Orders: Buyer-to-Farmer Flow](docs/report_assets/fig-05.svg)
- Figure 6. Payment Initialization Screen – ![Figure 6 – Payment Initialization](docs/report_assets/fig-06.svg)
- Figure 7. Chat UI and Unread Counter – ![Figure 7 – Chat UI and Unread Counter](docs/report_assets/fig-07.svg)
- Figure 8. Admin Dashboard – ![Figure 8 – Admin Dashboard](docs/report_assets/fig-08.svg)
- Figure 9. Lighthouse (Mobile/3G) – ![Figure 9 – Lighthouse (Mobile/3G)](docs/report_assets/fig-09.svg)
- Figure 10. Accessibility Audit (Axe) – ![Figure 10 – Accessibility Audit (Axe)](docs/report_assets/fig-10.svg)

---

## 1. Executive Summary

- Readiness: Amber (partially implemented). Core marketplace logic exists; several SDS-critical features are not yet implemented (PWA/offline, i18n, Telebirr/webhook verification, OpenAPI, realtime).
- Top Risks:
  - [Critical] Environment mismatch: `.env.example` points to MongoDB; backend uses Prisma/PostgreSQL.
  - [Critical] PWA/offline-first missing (no manifest/service worker/IndexedDB).
  - [Critical] i18n missing (UI English-only).
  - [Critical] Telebirr not integrated; webhooks lack signature verification.
  - [High] No Swagger/OpenAPI docs.
  - [High] Tokens stored in browser (not httpOnly cookies).
  - [High] Base64 image upload (no S3 presigned).
  - [High] Realtime missing (Socket.io not wired).
- Go/No-Go: No-Go for SDS-compliant MVP. Go for a limited internal pilot after addressing critical items.

## 2. Objectives and Scope

- Validate usability and functionality vs SDS across:
  - Auth/OTP, listings, search/filter, orders, escrow/payments, chat, admin.
  - PWA/offline-first, i18n, performance (3G), accessibility.
  - Security (non-invasive) and API contracts.


## 3. Test Environment and Dependencies

- Codebase: Next.js frontend; Express + Prisma backend.
- Expected URLs: FE http://localhost:3001, BE http://localhost:5000/api/v1 (health endpoint available).
- Environment Variables:
  - [Critical] Replace `.env.example` `DATABASE_URL` (MongoDB) with a valid Postgres URL to run Prisma.
  - Ensure `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`.
- Data: Seed users (FARMER/BUYER/ADMIN) recommended for tests.

![Figure 1 – Backend Health Check](docs/report_assets/fig-01.svg)

## 4. Methodology

- Static code review vs SDS.
- Planned manual and automated testing:
  - Lighthouse (mobile/3G), WebPageTest, Axe DevTools.
  - Browser console/network capture for flows.
  - Evidence capturing (screens, HARs, logs).
- Result types:
  - Verified by code inspection.
  - Executable test plans to run upon environment availability.

## 5. Architecture and Stack Overview

- SDS Target: NestJS + MongoDB Atlas + Redis + S3; PWA; OTP; escrow (Telebirr/Chapa); i18n; OpenAPI; realtime; monitoring.
- Actual Code:
  - Backend: Express, Prisma, PostgreSQL schema; routes/controllers for auth, products, orders, payments, chat, notifications; Helmet, rate limiting, CORS.
  - Frontend: Next.js; AuthContext; API wrapper; listings (create/list), login/OTP; server-status widget.
  - Infra gaps: No Swagger, no Redis, no S3 presigned, no service worker, no CI/CD, no Sentry/metrics.

## 6. Feature Coverage and Functional Results

### 6.1 Authentication and OTP
- Status: Implemented (OTP request/verify, register, login, refresh, logout). SMS provider not wired; OTP exposed in dev.
- Risks: Tokens stored in localStorage/cookies (non-httpOnly).
- Test Plan (key):
  - Request OTP (rate limits), verify OTP (valid/invalid/expired).
  - Register/login; refresh; logout; password reset and change.

![Figure 2 – Login/OTP Flow](docs/report_assets/fig-02.svg)

### 6.2 Listings/Products
- Status: CRUD implemented; geolocation autofill; image capture/upload (base64).
- Risks: No S3 presigned; payload size bloat; limited offline.
- Test Plan (key):
  - Create/edit/delete listing; filter/search/paginate; invalid inputs; large image handling.

![Figure 3 – Create Listing (Online)](docs/report_assets/fig-03.svg)

![Figure 4 – Create Listing (Offline Draft)](docs/report_assets/fig-04.svg)

### 6.3 Orders and Escrow/Payments
- Status: Orders implemented; payment init simulated; escrow model present; webhook handling without signature verification.
- Risks: No Telebirr; no webhook verification/idempotency; auto-release without scheduler.
- Test Plan (key):
  - Buyer pays → escrow hold → delivery → release; refunds; unauthorized release attempts; webhook replay/invalid signature scenarios.

![Figure 5 – Orders: Buyer-to-Farmer Flow](docs/report_assets/fig-05.svg)

![Figure 6 – Payment Initialization Screen](docs/report_assets/fig-06.svg)

### 6.4 Chat and Notifications
- Status: REST endpoints for messaging; notifications persisted; no realtime socket.
- Risks: Perceived latency; must ensure authz per conversation.
- Test Plan (key):
  - Send/receive; unread counts; mark read; role-bound access.

![Figure 7 – Chat UI and Unread Counter](docs/report_assets/fig-07.svg)

### 6.5 Admin
- Status: Static dashboard UI; not wired to backend.
- Test Plan (key):
  - Role-gated admin access; farmer verification moderation; listing moderation; audit logs.

![Figure 8 – Admin Dashboard](docs/report_assets/fig-08.svg)

## 7. Usability Evaluation (Mobile-First)

- Strengths: Clear forms and error states; server status cues; familiar patterns.
- Gaps: Offline UX not coherent; installability cues missing; language switching absent.
- Recommendations:
  - Add progress and retry for network errors; toast-to-URL state mapping; draft restore banners; consistent microcopy.

## 8. Accessibility (WCAG 2.1 AA)

- Focus areas: Keyboard navigability, focus visibility, labels/ARIA, contrast, descriptive alt text for images.
- Planned audits: Axe/Lighthouse; manual keyboard traversal; screen-reader sanity checks.
- Recommendations: Ensure semantic landmarks; ARIA for dynamic menus; larger touch targets; consistent headings.

![Figure 10 – Accessibility Audit (Axe)](docs/report_assets/fig-10.svg)

## 9. Performance (3G), Bundles, and Caching

- Likely bottlenecks: Base64 images; no SW caching; image optimization absent; potential large bundles.
- Targets: LCP < 2.5s; CLS < 0.1; INP < 200ms.
- Recommendations:
  - Next/Image with responsive sizes; preconnect to API; code-split admin; HTTP caching; image CDN; defer non-critical JS.

![Figure 9 – Lighthouse (Mobile/3G)](docs/report_assets/fig-09.svg)

## 10. PWA and Offline-First

- Status: Not implemented (no manifest/SW/IndexedDB).
- Plan:
  - Phase 1: Manifest + SW scaffold (Workbox); cache shell + listings; install prompt; offline banner.
  - Phase 2: IndexedDB for drafts/media; Background Sync; conflict resolution.
  - Phase 3: Offline details; periodic sync; update flow UX.

## 11. Internationalization (i18n)

- Status: English-only; no i18n library.
- Plan: Add next-intl/i18next; EN/AM/OM catalogs; locale switcher; date/number formats; search analyzers (if Postgres: trigram/synonyms; if Mongo: Atlas Search).

## 12. Security and Compliance

- Strengths: Helmet, CORS, route-level authz, tiered rate limits, centralized error handling.
- Gaps:
  - Tokens not httpOnly; webhook signature missing; no CSRF (if switching to cookies); limited audit logging; plaintext secrets in examples.
- Recommendations: httpOnly sameSite cookies (or robust XSS hardening if staying SPA tokens); HMAC webhook verification; request IDs + structured logs; secret management policy.

## 13. API Documentation and Contracts

- Status: No Swagger/OpenAPI.
- Recommendation: Add swagger-ui-express; generate OpenAPI (zod-to-openapi if using Zod); secure with admin auth; publish at /api/v1/docs.

## 14. Observability and DevOps

- Status: No CI/CD; no Sentry/metrics.
- Recommendation: GitHub Actions (lint, type-check, tests, build); Sentry FE/BE; pino logging; OTel/Prometheus metrics; dashboards and alerts; .env schema validation.

## 15. Defect Log (Prioritized)

- [Critical] DB/ORM mismatch
  - Summary: `.env.example` uses MongoDB; Prisma targets PostgreSQL.
  - Evidence: Add env and schema screenshots (Figure 1 and a schema capture).
  - Steps: Run backend with Mongo URL → Prisma fails.
  - Expected: Valid Postgres URL; migrations succeed.
  - Fix: Update `.env.example` to Postgres; add migrate/seed notes.

- [Critical] PWA/offline missing
  - Summary: No manifest/SW/IndexedDB.
  - Impact: SDS non-compliance; poor resilience.
  - Fix: Implement PWA phases (Sec. 10).

- [Critical] i18n missing
  - Summary: English-only UI.
  - Fix: Implement i18n infra and translations.

- [Critical] Payments
  - Summary: Telebirr not integrated; webhook signature not validated.
  - Fix: Integrate Telebirr; HMAC verify; idempotency keys; negative tests.

- [High] Session handling
  - Summary: Tokens in localStorage/cookies (non-httpOnly).
  - Fix: Use httpOnly cookies or harden CSP/XSS defenses.

- [High] S3 presigned uploads
  - Summary: Base64 payloads.
  - Fix: Presigned PUT; sanitize metadata; virus scan pipeline if needed.

- [High] Realtime
  - Summary: Socket.io not used.
  - Fix: Add socket server + Redis pub/sub; push notifications.

- [Medium] Admin UI not wired
  - Fix: Integrate moderation APIs; RBAC; audit trail.

- [Medium] API docs missing
  - Fix: Swagger/OpenAPI.

## 16. Recommendations and Roadmap

- Sprint 1 (Foundations)
  - Fix DB URL; migrations/seed; add Swagger; implement S3 presigned uploads; webhook signature verification; secure tokens; basic CI.

- Sprint 2 (UX/Functional)
  - PWA Phase 1; image optimization; admin wiring; structured logs + request IDs.

- Sprint 3 (SDS Compliance)
  - i18n (EN/AM/OM); Telebirr integration E2E; idempotency; refunds.

- Sprint 4 (Realtime & Observability)
  - Socket.io + Redis; notifications; Sentry + metrics; alerting; perf budgets.

## 17. Conclusion

- Core flows exist but SDS-critical features are missing. Address the critical items (DB env, PWA, i18n, payments security) to reach MVP readiness. This report provides executable test plans and clear milestones to reach compliance.

---

# Appendices

## Appendix A. Endpoint Groups (by Feature Area)

- Health
  - GET `/api/v1/health` (health-check)

- Auth
  - OTP request/verify, register, login, refresh, logout, password management (per auth.routes.ts)

- Products
  - Public listing, categories, locations, product details; protected CRUD for farmers (per product.routes.ts)

- Orders
  - Create, retrieve, update status, negotiate price (per order.routes.ts)

- Payments
  - Public webhook; protected init/get/release escrow (per payment.routes.ts)

- Chat
  - Send messages, conversations, unread, mark read (per chat.routes.ts)

- Notifications
  - Create/list/mark read/unread/delete (per notification service/routes)

Note: Exact paths vary per router; see `server/src/routes/*.ts`.

## Appendix B. Data Model Summary

- Users (roles: ADMIN, FARMER, BUYER), Profiles (farmer/buyer), Products, Orders, Payments (escrow fields), Messages, Notifications, OTP, Refresh tokens, Enums for statuses and languages.

## Appendix C. Device Matrix and Tooling

- Devices/Browsers
  - Android Chrome (Pixel 6; low-RAM Android)
  - Desktop Chrome/Edge (admin)
- Tools
  - Lighthouse, WebPageTest, Axe, Chrome DevTools, Postman, k6 (optional), Sentry (post-setup)

## Appendix D. Detailed Test Cases Catalog

- Provide step-by-step cases for Auth, Listings, Orders/Payments, Chat, Admin, PWA, i18n, A11y, Performance, Security (non-invasive). Include Expected vs Actual and Severity.


## Appendix E. Evidence Placeholders (Screenshots)

- Figure 1 – Backend Health Check: ![fig-01](docs/report_assets/fig-01.svg)
- Figure 2 – Login/OTP: ![fig-02](docs/report_assets/fig-02.svg)
- Figure 3 – Create Listing (Online): ![fig-03](docs/report_assets/fig-03.svg)
- Figure 4 – Create Listing (Offline Draft): ![fig-04](docs/report_assets/fig-04.svg)
- Figure 5 – Orders Flow: ![fig-05](docs/report_assets/fig-05.svg)
- Figure 6 – Payment Init: ![fig-06](docs/report_assets/fig-06.svg)
- Figure 7 – Chat UI: ![fig-07](docs/report_assets/fig-07.svg)
- Figure 8 – Admin Dashboard: ![fig-08](docs/report_assets/fig-08.svg)
- Figure 9 – Lighthouse Results: ![fig-09](docs/report_assets/fig-09.svg)
- Figure 10 – Accessibility Audit: ![fig-10](docs/report_assets/fig-10.svg)

## Appendix F. References

- SDS document provided by client.
- Repository code (server/controllers, routes, services; client/app pages and contexts).
- OWASP ASVS, WCAG 2.1 AA, Google Web Vitals.
