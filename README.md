# JobHunt CRM — Applicant Tracking (MERN)

A production-style MERN project to track job applications:
- Auth (JWT)
- Applications CRUD
- Kanban pipeline (Applied → Interview → Offer → Rejected)
- Reminders / follow-ups
- Analytics dashboard (conversion, stage counts)
- Docker + GitHub Actions CI

## Structure
- `server/` Node.js + Express + MongoDB (Mongoose)
- `web/` React + TypeScript + Vite

## Quick start (Docker)
1. Copy env files:
   - `server/.env.example` → `server/.env`
   - `web/.env.example` → `web/.env`
2. Run:
```bash
docker compose up --build
```
3. Open:
- Web: http://localhost:5173
- API: http://localhost:8080/health

## Seed demo account
```bash
cd server
npm run seed
```
Default demo login:
- demo@jobhunt.dev / Demo123!

## Deploy notes
in process
