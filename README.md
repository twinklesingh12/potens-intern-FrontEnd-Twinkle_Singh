# Cockpit Dashboard

Operations dashboard prototype built with React + Vite + Tailwind CSS.

## How To Run

### Prerequisites
- Node.js 18+ (Node.js 20 recommended)
- npm 9+

### Install
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Implemented Features

- Route-based app shell with dashboard on `/`
- Bilingual UI toggle (`English` / `Hindi`) across dashboard copy
- Dark mode toggle with `localStorage` persistence
- Live ticking countdown metric
- Quick action queue with `Approve` / `Hold`
- Hold flow with pause and resume of decision buttons
- Automated anomaly panel backed by mock JSON
- Anomaly trend graph (SVG bar chart)
- KPI cards that react to user actions and anomaly state

## Design Decisions

- Kept all translation text in one object (`src/App.jsx`) for simple state-driven language switching.
- Used component-local state in `DashboardPage` for fast interaction loops (approve/hold/remove animations) without introducing a global store.
- Used lightweight inline SVG for anomaly graph to avoid pulling chart dependencies for a prototype.
- Derived KPI values from live state rather than static literals so cards always reflect current queue/anomaly interactions.
- Used class-based dark mode with Tailwind custom variant and persisted theme preference in `localStorage`.

## What Is Broken / Unfinished

- No backend integration yet; quick actions and anomalies are mock-only.
- Action states (`approved`, `held`, `resolved`) are not persisted across refresh.
- Some Hindi and symbol rendering may vary by terminal/editor encoding; UI rendering in browser is expected to be correct in UTF-8.
- No automated tests yet (unit/integration/e2e).
- No accessibility audit yet (keyboard flow and ARIA behavior can be improved).

## What I Would Build Next

1. Wire quick actions and anomalies to real APIs with polling/websocket updates.
2. Persist action state server-side and add user/session attribution.
3. Replace mock KPI formulas with business-authored metric definitions.
4. Add test coverage for KPI derivation, hold/resume behavior, and language/theme persistence.
5. Add role-based permissions and audit trail for approve/hold decisions.

## Project Structure

```text
src/
  App.jsx                    # routing + global language/theme state
  main.jsx                   # BrowserRouter bootstrap
  index.css                  # tailwind import + dark variant
  pages/
    DashboardPage.jsx        # dashboard UI + interactive state logic
```
