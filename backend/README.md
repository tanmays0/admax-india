# AdMax India Backend

Express + MySQL API for the AdMax India hyperlocal advertising platform.

## Setup

1. Create a MySQL database from the schema:

```bash
mysql -u root -p < schema.sql
```

2. Copy env and fill in your MySQL password:

```bash
cp .env.example .env
```

3. Install and run:

```bash
npm install
npm run dev
```

4. (Optional) Seed demo users:

```bash
node scripts/seed.js
```

| Email | Password | Role |
|-------|----------|------|
| `advertiser@admax.in` | `password123` | advertiser |
| `partner@admax.in` | `password123` | partner |
| `admin@admax.in` | `password123` | admin |

API base: `http://localhost:5000/api`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login → JWT + user |
| GET | `/auth/me` | ✓ | Current user |
| GET | `/ads` | ✓ | List ads (own / all for admin) |
| POST | `/ads/upload` | ✓ | Multipart upload (`media`, `title`, `duration`) |
| DELETE | `/ads/:id` | ✓ | Delete own ad |
| GET | `/campaigns` | ✓ | List campaigns |
| POST | `/campaigns/create` | ✓ | Create campaign |
| GET | `/campaigns/:id` | ✓ | Campaign detail |
| GET | `/screens` | ✓ | List screens |
| POST | `/screens/add` | ✓ | Add screen |
| POST | `/assign/assign` | ✓ | Assign ad → screens |
| GET | `/player/:screenId` | — | Playlist for a screen |
| POST | `/payments/create-order` | ✓ | Create payment order |
| POST | `/payments/verify` | ✓ | Verify payment |
| GET | `/payments` | ✓ | Payment history |
| POST | `/onboarding/complete` | ✓ | Save onboarding profile |

Uploaded media is served from `/uploads/...` when Cloudinary is not configured.
