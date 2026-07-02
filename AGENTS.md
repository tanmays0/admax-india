# AdMax India

Full-stack "hyperlocal TV advertising" app.

- `backend/` — Express 5 REST API (`server.js`), MySQL via `mysql2`. Port `5000`.
- `frontend/` — React 19 + Vite SPA (`axios`, `react-router-dom`, `recharts`). Port `5173`, calls the API at `http://localhost:5000/api`.

## Cursor Cloud specific instructions

### Services
| Service  | Dir         | Run (dev)      | Port | Notes |
|----------|-------------|----------------|------|-------|
| Backend  | `backend/`  | `npm run dev`  | 5000 | nodemon; needs MySQL up first |
| Frontend | `frontend/` | `npm run dev`  | 5173 | Vite dev server |
| Database | —           | `sudo service mysql start` | 3306 | MySQL 8; must be started each session |

### Database (required for the backend to be useful)
- Connection is hard-coded in `backend/config/db.js`: host `localhost`, user `root`, password `root1115`, database `admax_india`. There is no `.env` for the backend; `PORT` defaults to `5000`.
- MySQL is installed in the VM but the service does not auto-start — run `sudo service mysql start` at the beginning of a session.
- The schema lives in `backend/schema.sql` (there is no ORM/migration tool). Recreate the DB + tables with:
  `mysql -u root -p'root1115' -h 127.0.0.1 < backend/schema.sql`
- Use `-h 127.0.0.1` (TCP) with the `mysql` CLI: the default unix socket at `/var/run/mysqld/mysqld.sock` gives a permission error in this sandbox. The Node app is unaffected because `mysql2` connects over TCP for host `localhost`.

### Lint / test
- `cd frontend && npm run lint` works but currently reports pre-existing errors/warnings in the app source (unused vars, hook deps) — these are not environment problems.
- There is no automated test suite (`backend` `npm test` is a placeholder).

### Gotcha: register form field mismatch
- `frontend/src/pages/Register.jsx` POSTs `businessName`/`city` (camelCase) while `authController.registerUser` reads `business_name`/`location`. Registering through the UI stores nulls for those columns; logging in still works. This is an app-code issue, not an environment issue.
