# Mobile-friendly deploy guide (JobHunt CRM)

## Recommended stack
- DB: MongoDB Atlas (free)
- API: Render (Web Service)
- Web: Vercel

### MongoDB Atlas
Create a free cluster and copy `MONGODB_URI`.

### Render (API)
- Root directory: `server`
- Build: `npm ci`
- Start: `npm start`
Env vars:
- `MONGODB_URI`
- `JWT_ACCESS_SECRET` (long random)
- `JWT_REFRESH_SECRET` (long random)
- `CORS_ORIGIN` = your Vercel URL
- `COOKIE_SECURE` = true
- `NODE_ENV` = production

### Vercel (Web)
- Root directory: `web`
Env vars:
- `VITE_API_URL` = your Render API base URL

## Seed demo user
You can run `npm run seed` on Render via a one-off deploy shell (or GitHub Actions using a secret).
