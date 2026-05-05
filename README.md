# LMS Local Setup

This repository contains the full LMS local development stack:

- `backend` - shared API server
- `admin-app` - admin portal
- `student-app` - student portal
- `faculty-app` - faculty portal

This guide sets up the whole system step by step for local development.

## 1. Prerequisites

Install these first:

- Node.js LTS
- npm
- MongoDB Community Server running locally
- Git

Optional but useful:

- MongoDB Compass
- VS Code

## 2. Project Structure

```text
LMS/
  backend/
  admin-app/
  student-app/
  faculty-app/
  .agents/rules/
```

Important notes about the current repo:

- The current runnable backend uses `Express + Mongoose + MongoDB`.
- The backend entrypoint is `backend/src/server.js`.
- Some older files in the repo still reference Prisma or older API assumptions.
- For local setup, follow the live backend config in `backend/src/config/env.js` and `backend/src/server.js`.

## 3. Local Ports

The apps are currently configured to run on these ports:

- Backend API: `5000`
- Admin app: `5173`
- Student app: `5174`
- Faculty app: `5175`

If one of these frontend ports changes automatically because the port is busy, backend CORS may block requests until you free the original port or update the allowed origins in `backend/src/config/env.js`.

## 4. Clone And Open The Project

```powershell
git clone <your-repo-url>
cd LMS
```

## 5. Install Dependencies

This repo is not using a single root workspace script right now, so install each app separately.

### Backend

```powershell
cd backend
npm install
cd ..
```

### Admin App

```powershell
cd admin-app
npm install
cd ..
```

### Student App

```powershell
cd student-app
npm install
cd ..
```

### Faculty App

```powershell
cd faculty-app
npm install
cd ..
```

## 6. Configure Environment Files

### Backend Environment

Copy the backend example file:

```powershell
cd backend
Copy-Item .env.example .env
cd ..
```

Make sure `backend/.env` contains values like:

```env
MONGO_URI="mongodb://localhost:27017/lms"
JWT_SECRET="replace-with-a-local-secret"
PORT=5000
NODE_ENV=development
```

Important:

- The live backend expects `MONGO_URI`.
- Do not use `DATABASE_URL` for the current server runtime.

### Frontend Environment

Each frontend should point to the shared backend API:

`admin-app/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

`student-app/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

`faculty-app/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## 7. Start MongoDB

Make sure MongoDB is running before starting the backend.

If you installed MongoDB as a local Windows service, start it through Services or your normal MongoDB startup method.

The backend expects this database:

- database name: `lms`
- connection string: `mongodb://localhost:27017/lms`

## 8. Start The Backend

Open a terminal:

```powershell
cd backend
npm run dev
```

Expected result:

- backend starts on `http://localhost:5000`
- health endpoint responds at `http://localhost:5000/api/health`

## 9. Start The Frontend Apps

Open three more terminals.

### Terminal 2 - Admin App

```powershell
cd admin-app
npm run dev
```

Open:

- `http://localhost:5173`

### Terminal 3 - Student App

```powershell
cd student-app
npm run dev
```

Open:

- `http://localhost:5174`

### Terminal 4 - Faculty App

```powershell
cd faculty-app
npm run dev
```

Open:

- `http://localhost:5175`

## 10. Verify The System

Check these in order:

1. Backend health check loads:

```text
http://localhost:5000/api/health
```

2. Admin app loads:

```text
http://localhost:5173
```

3. Student app loads:

```text
http://localhost:5174
```

4. Faculty app loads:

```text
http://localhost:5175
```

5. Browser console shows no API base URL errors.

## 11. Login Notes

The frontend login pages currently show demo credentials such as:

- `admin@lms.com / admin123`
- `faculty@lms.com / faculty123`
- `student@lms.com / student123`

These credentials only work if matching user records already exist in MongoDB.

Important current repo caveat:

- `backend/src/seed.js` is an older Prisma-based file.
- The current live backend is Mongoose-based.
- So the seed file should not be treated as a reliable local setup step in its current form.

If login fails even though the apps are running, the most likely reason is that the database does not yet contain valid users for the current backend.

## 12. Recommended Startup Order

Use this order every time:

1. Start MongoDB
2. Start backend
3. Start admin app
4. Start student app
5. Start faculty app

## 13. Common Problems

### `MONGO_URI is not set`

Fix:

- create `backend/.env`
- make sure it contains `MONGO_URI`
- restart the backend

### Frontend shows CORS or network errors

Fix:

- confirm backend is running on port `5000`
- confirm all frontend `.env` files use `http://localhost:5000/api`
- confirm frontend ports are still `5173`, `5174`, and `5175`

### Frontend opens on a different port

Fix:

- stop the app using the conflicting port
- restart Vite so it uses the intended configured port
- or update backend allowed origins in `backend/src/config/env.js`

### Login page loads but login fails

Fix:

- confirm MongoDB is running
- confirm the backend is connected successfully
- confirm the user exists in the database
- do not rely on the current legacy `backend/src/seed.js` without updating it first

### Older docs mention Prisma or port `3000`

Fix:

- use this README for local setup
- use `backend/src/config/env.js` and `backend/src/server.js` as the source of truth for the current runtime

## 14. Development Rules

If you are making changes in this repo, read:

- `.agents/rules/README.md`
- `.agents/rules/system-architecture.md`
- `.agents/rules/backend-rules.md`
- `.agents/rules/frontend-rules.md`
- `.agents/rules/ui-design-rules.md`
- `.agents/rules/domain-logic-rules.md`

These files define the project-specific development constraints for this LMS.

## 15. Quick Start Summary

If you just need the short version:

```powershell
# Terminal 1
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

```powershell
# Terminal 2
cd admin-app
npm install
npm run dev
```

```powershell
# Terminal 3
cd student-app
npm install
npm run dev
```

```powershell
# Terminal 4
cd faculty-app
npm install
npm run dev
```

Then open:

- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`

Backend API:

- `http://localhost:5000/api/health`
