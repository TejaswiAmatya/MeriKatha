# Docker + Deploy Guide

## 1. Prepare env
1. Copy `.env.example` to `.env` in repo root.
2. Fill `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET`.
3. (Optional) Fill `ANTHROPIC_API_KEY` for Aangan Bot.

## 2. Run locally with Docker
```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/api-docs`

## 3. Deploy backend (Railway/Render/Fly.io)
- Build context: `backend/`
- Dockerfile: `backend/Dockerfile`
- Required envs: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLIENT_URL`, `ANTHROPIC_API_KEY` (optional), `NODE_ENV=production`, `PORT=3001`
- For cross-domain frontend/backend auth cookies set:
  - `COOKIE_SAMESITE=none`
  - `COOKIE_SECURE=true`
  - `COOKIE_DOMAIN=` (usually blank unless you know you need a parent domain cookie)

## 4. Deploy frontend (Vercel/Netlify/Docker host)
- Build context: `frontend/`
- Dockerfile: `frontend/Dockerfile`
- Build arg: `VITE_API_URL=https://<your-backend-domain>`

## 5. Production checklist
- Set backend `CLIENT_URL` to exact frontend domain.
- Set frontend `VITE_API_URL` to backend HTTPS domain.
- Keep `NODE_ENV=production` in backend.
- If frontend and backend are different domains, set `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true`.
- Verify login cookie works over HTTPS.
- Test: signup/login, story post, sunein, bot, sahara links.
