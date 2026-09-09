# Cursor Cloud specific instructions

## Services

| Service | Command | Port |
|---------|---------|------|
| Backend API | `npm run dev --prefix backend` | 5000 |
| Frontend (Vite) | `npm run dev --prefix frontend` | 5173 |
| MySQL | local MySQL 8 or `docker compose up db -d` | 3306 |

Root helper: `npm run install:all` then `npm run schema:ensure && npm run seed && npm run dev`.

## Database

1. Copy `backend/.env.example` → `backend/.env` and set `DB_PASSWORD`.
2. Load schema: `mysql -u root -p < backend/schema.sql` (or rely on Docker init volume).
3. Backfill drift on existing DBs: `npm run schema:ensure`.
4. Demo users: `npm run seed`.

Demo logins (password `password123`): `advertiser@admax.in`, `partner@admax.in`, `admin@admax.in`.

## Gotchas

- Register/login expect `name` + `email` + `password` (and optional `role`).
- Screen map uses public `GET /api/screens/public` (no JWT).
- Player only serves ads with status `approved` or `active` and posts play events to `/api/player/:id/play`.
- Contact + partner applications persist to MySQL; admin reviews them under `/admin`.
- Stripe/OAuth/Razorpay are optional; without keys, checkout uses mock payment orders.
- Uploads are local disk (`backend/uploads`), not Cloudinary.

## Lint / format

```bash
npm run lint --prefix frontend
npm run lint --prefix backend
npm run format:check --prefix frontend
npm run format:check --prefix backend
```

## Smoke test

```bash
node backend/scripts/smoke-api.js
```
