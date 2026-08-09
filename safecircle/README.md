# SafeCircle — Frontend

Premium AI-powered personal safety dashboard. React 19 + Vite + TypeScript, built to match the SafeCircle Spring Boot backend exactly (no invented endpoints — every API call in `src/api` mirrors a real controller method).

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router · Axios · React Hook Form + Zod · Framer Motion · Lucide Icons · React Leaflet · Recharts · SockJS + STOMP · React Hot Toast · date-fns · clsx

## Getting started

```bash
npm install
cp .env.example .env   # adjust API/WS base URLs if needed
npm run dev
```

The app expects the SafeCircle Spring Boot backend running locally (default `http://localhost:8080`).

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | REST API base (matches `context-path: /api` in `application.yml`) |
| `VITE_WS_BASE_URL` | `http://localhost:8080/ws` | SockJS endpoint for STOMP over WebSocket |

## Project structure

```
src/
  api/          Axios service per backend controller + shared client/interceptors
  components/   ui/, layout/, dashboard/, map/ — reusable building blocks
  layouts/      AuthLayout, DashboardLayout, AdminLayout
  pages/        One folder per feature area (auth, dashboard, journey, tracking, ai, sos, ...)
  hooks/        useAuth, useAsyncAction, useFetchOnMount, useSocketStatus
  services/     socketService (STOMP/SockJS client with auto-reconnect)
  context/      AuthContext (JWT session, refresh, current user)
  routes/       router.tsx, ProtectedRoute/PublicOnlyRoute
  types/        TypeScript mirrors of every backend DTO/enum
  utils/        cn, format, schemas (Zod), tokenStorage
```

## Backend contract notes

A few backend controllers intentionally **do not** wrap responses in `ApiResponse<T>` — they return the DTO directly. The API layer respects this exactly:

- `DashboardController` (`/dashboard/**`) — unwrapped
- `AnalyticsController` (`/analytics/**`) — unwrapped
- `OpenStreetMapController` (`/openstreet/**`) — unwrapped
- Everything else — wrapped in `{ success, message, data }`

## Authentication

- JWT access token + refresh token issued on `/auth/login`.
- Axios request interceptor attaches `Authorization: Bearer <token>` automatically.
- Response interceptor catches `401`, calls `/auth/refresh-token` once (queueing concurrent requests), retries the original call, and force-logs-out if the refresh itself fails.
- Tokens are persisted in `localStorage` via `src/utils/tokenStorage.ts`.

## Real-time (WebSocket)

`src/services/socketService.ts` wraps `@stomp/stompjs` + `sockjs-client` with auto-reconnect (`reconnectDelay: 4000`) and topic-based subscriptions matching `WebSocketServiceImpl` exactly:

- `/topic/location/{journeyId}` — live location broadcast
- `/topic/alert/{journeyId}` — alert/SOS broadcast
- `/topic/notification/{userId}` — notification push
- `/topic/journey/{journeyId}` — journey status changes

The Live Tracking page publishes the browser's `watchPosition` stream to `/app/location` and also persists it via `POST /location/update` for durability.

## Build

```bash
npm run build      # tsc -b && vite build -> dist/
npm run preview    # serve the production build locally
```

## Notes

- No light mode — dark glassmorphism theme only, per design brief.
- Leaflet uses CARTO dark basemap tiles + custom glowing `divIcon` markers (no dependency on Leaflet's default marker image assets).
- Admin routes (`/admin`, `/admin/users`) are gated by `role === 'ADMIN'` via `ProtectedRoute`.
