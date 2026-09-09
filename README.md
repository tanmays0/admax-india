# AdMax India

![CI](https://github.com/tanmays0/admax-india/actions/workflows/ci.yml/badge.svg)

Hyperlocal B2B digital advertising platform — React frontend + Express/MySQL backend.

## Quick start (local)

```bash
# One-time: install everything
npm run install:all

# Ensure MySQL schema + seed demo users (backend/.env must have your DB password)
npm run schema:ensure
npm run seed

# Run API + web together
npm run dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5000/api  
- In development the Vite proxy forwards `/api` and `/uploads` to the backend.

### Demo accounts

| Email | Password | Role |
|-------|----------|------|
| `advertiser@admax.in` | `password123` | advertiser |
| `partner@admax.in` | `password123` | partner |
| `admin@admax.in` | `password123` | admin |

## Docker

```bash
npm run docker:up          # MySQL + API + web on :8080 / :5000
npm run docker:logs
npm run docker:down
```

Web UI: http://localhost:8080 · API health: http://localhost:5000/healthz

## Project layout

```
admax-india/
├── frontend/                 React 19 + Vite + Tailwind (+ nginx image)
├── backend/                  Express 5 + MySQL2 + JWT/OAuth/Stripe
├── docker-compose.yml        Local full stack
├── k8s/                      Kubernetes manifests (Deploy/Svc/Ingress/HPA)
├── infra/                    Terraform modules + env compositions
├── .github/workflows/        CI, Terraform, Deploy
└── package.json              Root scripts
```

## Environment

Copy examples and edit passwords/secrets:

- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`

`VITE_API_URL=/api` uses the Vite proxy in local dev. For production builds, set it to your public API URL (e.g. `https://api.yourdomain.com/api`).

## CI / CD

| Workflow | Purpose |
|----------|---------|
| `.github/workflows/ci.yml` | Lint, format check, frontend build, Docker image builds |
| `.github/workflows/terraform.yml` | `fmt` / `validate` / `tflint`; optional plan/apply via `ENABLE_TF_PLAN` |
| `.github/workflows/deploy.yml` | Build/push GHCR images; optional EKS apply via `ENABLE_K8S_DEPLOY` |

## Terraform / Kubernetes

See [`infra/README.md`](infra/README.md) and [`k8s/README.md`](k8s/README.md).

High level:

1. Bootstrap remote state (`infra/bootstrap`)
2. Apply `infra/environments/dev` (VPC, ECR, EKS, RDS)
3. Push images to ECR/GHCR
4. `kubectl apply -k k8s/` (point DB host at RDS; replace image tags)
