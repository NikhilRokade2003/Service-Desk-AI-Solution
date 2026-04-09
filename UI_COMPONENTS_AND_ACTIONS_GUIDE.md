# UI Components and Actions Guide

This document describes all visible components, fields, and button actions across the current frontend routes:

- `/login`
- `/dashboard`
- `/triage`
- `/tickets`
- `/queues`

---

## 1) `/login` — LoginPage

### Left Brand Panel

- **Jade logo badge (J)**: Branding only (no click action)
- **Title**: "AI-Powered Service Intelligence" (display only)
- **Powered badge**: "Powered by Infra Automation Hub" (display only)
- **Animated background**: visual only

### Login Form Card

1. **Email input**
   - Type: `email`
   - Expected value: enterprise email (example: `name@jadeglobal.com`)
   - Required for Sign In / Sign Up

2. **Password input**
   - Type: `password` (toggleable)
   - Expected value: user password
   - Required for Sign In / Sign Up

3. **Eye / Eye-off toggle button**
   - Action: toggles password visibility (`password` <-> `text`)
   - Backend effect: none

4. **Sign In button**
   - Action: submits credentials to login handler
   - Current behavior:
     - validates required fields
     - shows loading spinner
     - stores auth state (`jade-auth`)
     - redirects to `/dashboard`

5. **Sign Up (New User) button**
   - Action: submits credentials to signup handler
   - Current behavior:
     - validates required fields
     - runs mock signup flow
     - stores signup email + auth state
     - redirects to `/dashboard`

6. **Inline error alert**
   - Displays validation or request error messages
   - No click action

---

## 2) Shared Shell Components (Authenticated Routes)

## Sidebar

### Navigation Buttons

1. **Dashboard** -> `/dashboard`
2. **Triage** -> `/triage`
3. **Tickets** -> `/tickets`
4. **Queues** -> `/queues`
5. **Login** -> logs out and routes to `/login`

### Other Controls

- **Collapse/Expand button**: toggles sidebar width
- **Queue badge count**: display-only counter

## Topbar

1. **Search input**
   - Captures global search text
   - Used by tickets view flow

2. **Theme toggle**
   - Switches light/dark theme
   - Persists via `jade-theme`

3. **Notifications bell**
   - Opens/closes notification dropdown

4. **Notification items**
   - Display-only in current implementation

5. **User avatar/profile**
   - Display only

---

## 3) `/dashboard` — Dashboard Component

### KPI Cards (display only)

1. **Total Tickets**
2. **Auto-Resolved**
3. **Avg Confidence**
4. **Escalated**

Data source currently: frontend mock constants.

### Recent Tickets Table

- Columns: ID, Subject, Queue, Confidence, Routing, Created
- Current behavior: display only

### Queue Distribution Donut Chart

- Recharts donut chart + tooltip
- Current behavior: display only

### Live Refresh Indicator

- Pulse + time update every 30 seconds
- Visual status only

---

## 4) `/triage` — TriagePage

## Left Panel: Ticket Submission

1. **Subject input**
   - Required
   - Short issue summary

2. **Description textarea**
   - Required
   - Detailed issue context

3. **Queue Override dropdown**
   - Optional manual queue selection
   - Overrides displayed queue in final result when selected

4. **Category Override dropdown**
   - Optional manual category selection
   - Overrides displayed category in final result when selected

5. **Analyze Ticket button**
   - Current behavior:
     1. validates required fields
     2. starts async triage job (`POST /api/v1/tickets/triage`)
     3. polls status (`GET /api/v1/tickets/triage/{job_id}`)
     4. renders result on completion
     5. shows inline error if job fails/times out

## Right Panel: AI Result Area

States:

1. Empty state (before analysis)
2. Skeleton state (during polling)
3. Result card state (after success)

### TriageResultCard Controls

1. **Accept & Close**
   - Current behavior: inline success/status message

2. **Override Queue**
   - Current behavior: inline status message

3. **Escalate**
   - Current behavior: inline status message

### Additional Toggles

- **Resolution steps Show all / Show less**
- **Reasoning Expand / Collapse**
- **SOP chip click** (UI only; navigation prevented)

---

## 5) `/tickets` — TicketsPage

## Filter Bar

1. **Search input**
2. **Queue dropdown**
3. **Category dropdown**
4. **Date From**
5. **Date To**

Each control updates visible ticket list and fetch/filter flow.

## Tickets Table

Columns:

- ID
- Subject
- Queue
- Category
- Confidence (mini progress bar)
- Routing (status badge)
- Date
- Actions

### Interactions

- **Header click**: sort by column (toggle asc/desc)
- **Row click**: opens ticket detail slide-over
- **View button**: opens same slide-over panel

## Pagination

1. **Prev**
2. **Page numbers**
3. **Next**

Also shows: "Showing X of Y tickets"

## Ticket Detail Slide-over

1. **Close (X)**: closes panel
2. Embedded triage result card with action buttons
   - Current actions close or update local UI state only

---

## 6) `/queues` — QueuesPage

## Summary Cards

1. **Total Open**
2. **SLA Breached**
3. **Avg Resolution Time**

Current behavior: display-only summary metrics.

## Queue Cards Grid

Each queue card includes:

- queue name
- ticket count
- avg confidence
- top category
- 7-day mini bar chart

### Card Button

1. **View Queue**
   - Writes selected queue to local state storage
   - Navigates to `/tickets`
   - Tickets page opens pre-filtered for that queue

---

## 7) Operational Notes

1. **Async triage is now enabled**
   - UI no longer waits on one blocking triage request
   - Uses job start + polling endpoints

2. **Why triage can be slow**
   - ReAct multi-step reasoning
   - retrieval tool calls (tickets + SOP)
   - LLM response latency and retries
   - parsing/validation retries

3. **Action buttons are currently UI-level**
   - Accept/Override/Escalate are surfaced as UI status actions
   - End-to-end backend ticket lifecycle persistence can be wired next

