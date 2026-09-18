# AdMax India

Full-stack hyperlocal TV advertising app — **single source of truth** at this repository root.

- `backend/` — Express 5 REST API (`server.js`), MySQL via `mysql2/promise`. Port from `backend/.env` (`PORT`, local default **5001** on macOS).
- `frontend/` — React 19 + Vite SPA. Dev port **8080**. API base URL from `VITE_API_URL` in `frontend/.env` (see `frontend/.env.example`).

## Local development (canonical)

| Service | Dir | Run | Port |
|---------|-----|-----|------|
| Backend | `backend/` | `npm run dev` | `PORT` from `.env` (**5001**) |
| Frontend | `frontend/` | `npm run dev -- --port 8080 --host 127.0.0.1` | **8080** |
| Database | — | `brew services start mysql` | 3306 | DB name `admax_india` |

### Environment
- Copy `backend/.env.example` → `backend/.env` (do not commit secrets).
- Frontend: `VITE_API_URL=http://127.0.0.1:5001/api`
- Backend: `PORT=5001`, `FRONTEND_URL=http://localhost:8080`, `APP_URL=http://localhost:5001`
- Schema upgrades: `cd backend && npm run schema:ensure`

### Lint / test
- `cd frontend && npm run lint`
- Backend `npm test` is a placeholder.
