# EMRS — Claude Code Instructions

## Project Overview
**EMRS (Equipment & Resource Management System)** — Internal operations platform for WellFluid Services Nigeria, an oilfield service company. React frontend, Node.js/Express backend, PostgreSQL database. PWA-enabled SaaS for equipment tracking, resource requests, and departmental workflows.

**Project root:** `C:\Users\danie\Desktop\Codes\v2.2 release\emrs`
**Frontend:** `./frontend/` (Vite + React + Tailwind + Zustand + SWR)
**Backend:** `./backend/` (Express + PostgreSQL + JWT + Zod)

---

## MVP Scope — What's Launching

### In MVP — EVERYTHING SHIPS (Launch Readiness Sprint, Nov 8, 2026)
- **Auth** — Login, JWT sessions, role-based routing
- **Requests** — PPE, Material, Transport, Equipment, Maintenance request creation and approval workflows
- **Maintenance workflow** — Engineer → Manager → Purchasing → Work Order (multi-step approval)
- **Purchasing** — Disbursement of approved requests, inventory linking
- **Equipment** — Tracking, status management, **Tool/Equipment categorization** (via `asset_category` enum)
- **Jobs** — Full lifecycle (create → approve → start → post-job → complete) + purchasing queue. Launched to operational roles (was Super_Admin preview).
- **Field Reports** — `modules/field-reports/` backend + `features/field-reports/` frontend (list/detail/create/review/approve/reject).
- **Vehicles** — Live, CRUD, in purchasing sidebar.
- **Reports/Analytics** — `modules/reports/` backend + `features/reports/` frontend (Equipment Utilization, Request Analytics, Maintenance Costs, Safety Overview) with recharts.
- **Dashboards** — Role-based (Engineer, Manager, Admin, Purchasing, Accounts, Safety)
- **Notifications** — In-app (live). SMS via Termii = LAST item (not yet wired live).
- **Activity Logs** — System-wide audit trail

### Deferred — ONLY remaining item
- **Termii SMS / email delivery** — wire last. In-app notifications work; SMS/email providers not yet configured (`SMS_ENABLED=false`).

---

## Coding Standards — STRICT

### File Size Limits
| File Type | Max Lines | If Exceeded |
|-----------|-----------|-------------|
| Component | 100 | Split into sub-components |
| Page | 150 | Extract sections to components |
| Hook | 80 | Split by concern |
| Service | 100 | Split by entity |
| Controller | 80 | One action per function |
| Utils | 50 | Group related functions |

### Rules
- **No monolithic files** — Split anything approaching limits
- **Single Responsibility** — Each file does ONE thing
- **No console.log in production code** — Use proper error handling
- **No hardcoded URLs** — Use API service/interceptors
- **Memoize expensive components** — Use React.memo where needed
- **Error handling everywhere** — try/catch with meaningful messages
- **Activity logging** — Log all user actions that change state
- **Dark mode support** — All UI must work in both themes

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `EquipmentCard.jsx` |
| Hooks | camelCase with "use" | `useEquipment.js` |
| Services | camelCase with suffix | `equipmentApi.js` |
| Constants | UPPER_SNAKE_CASE | `REQUEST_STATUS` |
| Routes | kebab-case | `/equipment-list` |

### Design Aesthetic — "Industrial Premium"
- Colors: Carbon Black, Petroleum Gold (#FF6B00), Nigeria Green
- Professional, authoritative — not generic tech startup
- Dark mode uses `dark:bg-[#0f1419]`, `dark:bg-[#1a1f26]`, `dark:bg-[#242b33]`
- Consistent border treatment: `border-gray-100 dark:border-white/10`

---

## Database Enum Reference — VERIFIED March 26, 2026

These are the actual PostgreSQL enum values (from `SELECT enum_range`). Code MUST match exactly.

### notification_type
**Active (sent by backend code):**
```
REQUEST_APPROVED, REQUEST_REJECTED, REQUEST_DISBURSED,
TRANSPORT_ASSIGNED, RETURN_OVERDUE, RETURN_INITIATED, RETURN_CONFIRMED,
RETURN_OVERDUE_ESCALATION, RETURN_OVERDUE_URGENT,
VENDOR_ADDED, LOW_STOCK_ALERT, GENERAL,
WORK_ORDER_CREATED, WORK_ORDER_COST,
Work_Order_Completed, High_Cost_Work_Order,
EXTENSION_REQUESTED, EXTENSION_SUBMITTED,
EXTENSION_MANAGER_APPROVED, EXTENSION_PROGRESS,
EXTENSION_APPROVED, EXTENSION_REJECTED
```
**Legacy (in DB but unused — do not use in new code):**
```
Request_Approved, Request_Rejected, Request_Disbursed,
Return_Reminder, Transport_Assigned, Vendor_Added,
Stock_Low, Maintenance_Due, System, Payment_Recorded
```

### priority_level
```
Low, Medium, High, Critical
```
**NOT "Urgent"** — any code referencing "Urgent" as a priority is wrong.

### maintenance_type
```
Scheduled, Unscheduled, Repair, Inspection,
Routine_Service, Calibration, Overhaul, Emergency
```
Note: `Scheduled` and `Unscheduled` are legacy values in DB. Active forms use: `Routine_Service, Repair, Inspection, Calibration, Overhaul, Emergency`.

### request_status
```
Pending, Approved, Manager_Approved, Rejected, Cancelled,
Completed, On_Hold, Disbursed, Pending_Return, Transferred
```

### user_role
```
Field_Engineer, Operator, Technician, Logistics_Coordinator,
Workshop_Manager, Operations_Manager, Department_Manager,
Safety_Officer, Purchasing_Manager, Purchasing_Officer,
Maintenance_Manager, Maintenance_Technician, Admin, IT_Manager,
Super_Admin, IT_Support, Staff, Purchasing_Staff,
Logistics_Manager, Safety_Manager, Accounts_Manager,
Accounts_Staff, HR_Manager
```
Note: `IT_Admin` was renamed to `IT_Manager` in migration 014.

---

## Request Workflow

### Standard Requests (PPE, Material, Transport, Equipment)
```
Engineer creates → Pending → Manager approves → Approved → Purchasing disburses → Disbursed
```

### Maintenance Requests (multi-step)
```
Engineer creates → Pending → Manager approves (adds cost estimate, notes, vendor)
→ Manager_Approved → Purchasing approves (confirms vendor, links inventory, final cost)
→ Approved + Work Order created → Purchasing disburses → Disbursed
```

### Notes Flow
- **Engineer:** `details.additionalNotes` (maintenance) or `details.purpose`/`details.reason` (others)
- **Manager:** `details.managerNotes` + approval_history comments
- **Purchasing:** `details.purchasingNotes` + approval_history comments
- Each role sees notes from previous steps in the chain

---

## Task Status — Updated May 1, 2026

### ✅ DONE — Phase 1
| Task | Description |
|------|-------------|
| 1.1 | Notification enum mismatch — code + DB fixed |
| 1.2 | Urgent → Critical in constants.js + ManagerDashboard |
| 1.3 | Load audit trail in request getById |
| 1.4 | ApprovalHistory field name alignment |
| 1.5 | canDisburse for procurement items (V2 + MaintenanceQueuePanel) |
| 1.6 | Maintenance notes/specs/details in disburse modal |
| 1.7 | maintenance_type alignment — code + DB fixed |

### ✅ DONE — Security
| Task | Description |
|------|-------------|
| N1 | JWT secret externalized (no more hardcoded) |
| N7 | LoginPage uses API service (no hardcoded localhost) |
| B4 | httpOnly cookie auth (additive — cookie set on login, read first by middleware, cleared on logout; Bearer header fallback preserved) |

### ✅ DONE — MVP Blockers (completed Feb 25, 2026)
| Task | Description |
|------|-------------|
| 2.4 | AccountsDashboard + Accounts role routing |
| 2.5 | Safety_Officer dashboard routing + sidebar nav |

### ✅ DONE — Should-Have (completed Feb 25, 2026)
| Task | Description |
|------|-------------|
| 2.1 | Notification click navigation |
| 2.2 | Notify purchasing when request approved |
| 2.3 | NotificationBell dark mode |
| 3.2 | Request description display on engineer dashboard |
| 3.3 | Assigned equipment count |
| 3.4 | Purchasing "Awaiting Review" stat card |
| 4.1 | SWR central auto-refresh (60s) |
| N10 | Remove console.log from authStore.js |

### ✅ DONE — Sprint 3 Backend Hardening (May 1, 2026)
| Task | Description |
|------|-------------|
| B2 | Performance indexes — 015_performance_indexes.sql (10 indexes, CONCURRENTLY IF NOT EXISTS) |
| B3 | Console.log cleanup — verified clean; only 26 remain in migrate.js/seed.js/logger.js (all legitimate CLI/internal) |
| B4 | httpOnly cookie auth — additive migration (login sets cookie, middleware reads cookie first then Bearer header, logout clears cookie, frontend withCredentials: true) |
| B5 | Error boundaries — ErrorBoundary already existed + wired to App.jsx; added content-level boundary to MainLayout (sidebar survives route errors) |
| BUG-ACTIVITY-NULL | equipmentLogs.controller.js createGeneralLog: ACTIONS.CREATE (undefined) → ACTIONS.EQUIPMENT_HOURS_LOGGED; added null guard in logActivity |

### 🔍 FEATURE AUDIT — Nov 7, 2026 (code-level, investigate-only; NOT run live)

Full audit of Accounts, Jobs, Safety, Vehicles, Field Reports, dead code, post-MVP items.
**No 🔴 BROKEN crashers found** — this tree already contains the Build-Pass-1 safety/jobs/maintenance fixes.
Could not run live (no EMRS `.env`/DB present; only an unrelated `supabase_db_wta-site` container was up and left untouched).

**Already DONE despite being listed post-MVP above (table below is corrected):**
- N4 Rate limiting — `backend/src/middleware/rateLimiter.js` (apiLimiter 500/win on `/api`, authLimiter 10/hr, passwordResetLimiter 3/hr), applied in `app.js`.
- 3.5 Notification auto-refresh — `useNotifications.js` SWR `refreshInterval`.
- 4.4 PWA icons — `frontend/public/` has pwa-192/512 + apple-touch-icon; `vite.config.js` manifest wired (verify they're real WFSL icons, not placeholders).
- 3.1 Activity log pagination+filters — `ActivityLogs.jsx` has filters + page/handlePageChange; backend returns `{page,totalPages,total}`.

**Confirmed working (no action):** Safety new fields `actions_taken`/`witnesses` fully wired form→validation→query→detail; migration `003_safety_report_fields.sql` applies clean vs 001 (both IF NOT EXISTS). Accounts API paths match backend exactly. `safety.zip` already removed.

**Prioritized fix list (awaiting user's go-ahead — do NOT auto-start):**

| Pri | Class | Item |
|-----|-------|------|
| 1 | 🟢 POLISH | Delete dead files: purchasing `features/purchasing/components/DisburseModal.jsx` (361 ln, no importer; live one is `DisburseModalV2.jsx`) + its only-consumer `ItemLinkingTableWithConsumable.jsx`; accounts `features/accounts/components/PaymentRecordModal.jsx` (185 ln, zero importers; live one is `RecordPaymentModal.jsx`). NOTE: `jobs/pages/purchasing/DisburseModal.jsx` is a SEPARATE live file — do not touch. |
| 2 | 🟢 POLISH | Consolidate toasts onto `useUiStore` (17 importers); migrate 3 `react-hot-toast` sites (`main.jsx` Toaster, `services/api.js`, `useAuth.js`), drop `<Toaster>` + dep. |
| 3 | 🟢 POLISH | Fix stale post-MVP table (done below). |
| 4 | 🟢 POLISH | Split over-limit files: `AccountsDashboard.jsx` (192 ln > 150) and `useAccounts.js` (231 ln, 7 hooks in one file > 80). Also `console.error` calls in AccountsDashboard/useAccounts (CLAUDE.md bans console in prod). |
| 5 | 🟡 DECISION | Vehicles is LIVE + in sidebar (3 role variants) + routed `/purchasing/vehicles`, despite "deferred" label. Keep exposed or gate/hide? |
| 6 | 🟡 DECISION | Jobs fully wired end-to-end (status flow submit→approve→start→post-job→complete + purchasing queue) but gated `DEV_PREVIEW_ROLES` (Super_Admin only). Widen access or keep preview-gated? |
| 7 | ⚪ DEFER | Field Reports — backend complete (list/stats/my/pending/create/review/approve/reject/attachments, Submitted→Approved/Rejected), ZERO frontend. Per MVP = defer; ready to build UI against when wanted. |

### ✅ DONE — LAUNCH READINESS SPRINT (Nov 8, 2026)

Ran the full 9-phase launch sprint. App runs locally (Postgres container, migrations 001-003, seed; backend :5001 — moved off :5000 which macOS ControlCenter owns; frontend :3000). Final `npm run build` passes clean; Super_Admin smoke = 19/19 modules.

**Backend bug fixes (Phase 3 — found via live verification):**
- `equipment.service.js` — `serial_number` is NOT NULL + UNIQUE but validation marks it optional → now auto-generates a unique `AUTO-<ts>-<rand>` placeholder when omitted (was a 500 crasher).
- `jobs/queries/jobs.queries.js` — job `create`/`update`/`generateNumber` were deliberately absent (read-only rewrite) → job creation 500'd. Added them; job_number format `JOB-YYYY-####`.
- `field-reports.routes.js` — added `Super_Admin` to every `requireRoles` list (was omitted everywhere; `requireRoles` has no Super_Admin bypass).

**Phase 4 — Jobs launched:** `JOBS_ROLES` (Super_Admin, Admin, Operations/Maintenance/Workshop Manager, Field_Engineer) replaces `DEV_PREVIEW_ROLES` in `jobsRoutes.jsx`. Sidebar: Jobs added to manager + new Field Engineer sidebar; "In Development" divider → "Operations"; Jobs/Purchasing Queue exposed. NOTE: `Department_Manager` is in the DB enum but NOT the frontend `ROLES` map — not granted.

**Phase 5 — Equipment categorization:** Uses the EXISTING `asset_category` enum (TOOL/EQUIPMENT) — NO new `category` column/migration (would have duplicated). Frontend was mostly pre-built; added URL-param tab state (`?category=`) + category badge on `EquipmentCard`.

**Phase 6 — Field Reports frontend:** `features/field-reports/` (list/detail/create + `useFieldReports` + service + FieldReportCard/StatusBadge/ReviewActions). Routes + sidebar (Super_Admin, managers, engineers). Lifecycle verified create→review→approve.

**Phase 7 — Reports & Analytics:** NEW backend `modules/reports/` (request-analytics, safety-overview, equipment-utilization, maintenance-costs — gated to manager/admin roles, reuses accounts cost queries). NEW frontend `features/reports/` (Hub + 4 pages) using **recharts** (installed). Sidebar for all MANAGER_ROLES. NOTE: no `ReportFilters` component — the roll-up endpoints take no filters, so it would be a dead control.

**Phase 8 — Cleanup:** Deleted dead files (`purchasing/DisburseModal.jsx` [live=DisburseModalV2], `ItemLinkingTableWithConsumable.jsx`, `accounts/PaymentRecordModal.jsx` [live=RecordPaymentModal]). Toasts consolidated onto `useUiStore` (migrated main.jsx/api.js/useAuth.js; `react-hot-toast` uninstalled). Split `useAccounts.js` (231→ 4 files <80) and `AccountsDashboard.jsx` (192→92) + extracted `WorkOrderList`/`useWorkOrderExport`; removed all `console.error`.

**Dev note:** seeded users ship with `must_change_password=true` — cleared in the local DB for testing. Accounts users exist (`accounts.manager@wellfluid.com` etc., pw `password123`).

### ⬜ POST-MVP — Don't Touch Now
| Task | Description |
|------|-------------|
| 3.1 | ~~Activity log pagination count with filters~~ — DONE (audit Nov 7, 2026) |
| 3.5 | ~~Auto-refresh notification list~~ — DONE (SWR refreshInterval) |
| 3.7 | Persist top-level request notes to DB |
| 4.2 | ~~Remove duplicate toast system~~ — DONE (Launch sprint, Nov 8) |
| 4.3 | Seed accounts test users — accounts users exist; ensure in seed proper |
| 4.4 | ~~PWA icons~~ — DONE (verify not placeholders) |
| 5.1-5.5 | Refactoring, error boundaries, skeletons |
| N2 | Job status enum (NOT IN MVP) |
| N3 | User role enum gaps — `Department_Manager` missing from frontend ROLES |
| N4 | ~~Rate limiting~~ — DONE (rateLimiter.js) |
| N5 | Transaction wrapping |
| N6 | Field report permissions (NOT IN MVP) |
| N8 | Equipment status format |
| N9 | React error boundaries |
| N11-N15 | Various polish items |

---

## Key Architecture Notes

### Frontend State
- **Auth:** Zustand store (`authStore.js`) with persist middleware
- **UI:** Zustand store (`uiStore.js`) for toasts, sidebar state
- **Server data:** SWR for all API data fetching with caching
- **Forms:** react-hook-form + Zod validation

### Backend Structure
- **Modular monolith** — `src/modules/{feature}/` with controller, service, routes, queries
- **Auth:** JWT with bcrypt passwords
- **DB:** PostgreSQL with enum types — MUST match code exactly
- **Notifications:** Termii SMS for Nigerian operations
- **Activity logging:** `activityLogger.js` wraps all state-changing actions

### Common Gotchas
- **Enum mismatches** — PostgreSQL enums are case-sensitive. Always verify code values match DB.
- **Role checks** — Use case-insensitive comparison: `role.toLowerCase().includes('purchasing')`
- **Dark mode** — Every UI element needs `dark:` variants
- **Details JSON** — Request details stored as JSONB. Different request types have different schemas.
- **SMS > Email** — Nigerian infrastructure favors SMS. Termii is the provider.
