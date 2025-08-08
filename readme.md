## JIRAO

Space rental marketplace with Guest, Host, and Admin roles. Frontend is React + Vite + TypeScript + Tailwind. Backend is FastAPI with a MySQL database. A mock API is included for quick demos.

### Tech stack
- Frontend: React 18, Vite 5, TypeScript, Tailwind CSS, `lucide-react`
- Backend: FastAPI, Uvicorn, MySQL (via `mysql-connector-python`)

### Repo layout
- `src/`: React app (components for Guest/Host/Admin, auth context, services)
- `backend/`: FastAPI app (`main.py`) with endpoint stubs and MySQL wiring
- `supabase/`: SQL migrations (reference only). Backend currently targets MySQL

---

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MySQL server (local or remote)

On Windows PowerShell you may need execution policy for venv activation: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## Quick Start (Frontend + Backend)

### 1) Backend (FastAPI)
1. Create and configure a MySQL database (default expected name: `jirao_db`). Update credentials in `backend/main.py`:
   - host, database, user, password
2. Install dependencies and run the API on port 8000

PowerShell (Windows):
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Bash (macOS/Linux):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- Many endpoints in `backend/main.py` include detailed TODOs and SQL examples; implement these for full functionality.
- Test the server: `http://localhost:8000/docs` (Swagger UI) or `http://localhost:8000/api/test`.

### 2) Frontend (Vite React)
1. Install dependencies and start the dev server on port 5173

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

By default, the frontend expects the backend at `http://localhost:8000/api` (see `src/services/api.ts`).

---

## Optional: Run with Mock API (no backend required)
The repo includes `src/services/mockApi.ts` with rich in-memory data for demos. To use it without changing all imports, replace the contents of `src/services/api.ts` with a single re-export:

```ts
// src/services/api.ts
export { mockApi as api } from './mockApi';
```

Revert to the real API by restoring the original file.

Demo credentials shown on the login screens (e.g., `john_guest`, `sarah_host`, and `admin_user`) will work against the mock API.

---

## Configuration
- API base URL is hardcoded in `src/services/api.ts` as `http://localhost:8000/api`.
- CORS in `backend/main.py` allows `http://localhost:5173` by default.
- Database credentials are in `backend/main.py` within `get_db_connection()`.

---

## Available Scripts
Frontend (package.json):
- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

Backend:
- `uvicorn main:app --reload --port 8000`: Run FastAPI with autoreload
- Or `python backend/main.py`

---

## Features (UI)
- Guest: browse/search spaces, view details, express interest
- Host: manage listings, create/update availability, see interest counts
- Admin: user management, reports, host approval

Role routing and auth state are handled in `src/contexts/AuthContext.tsx` and `src/App.tsx`.

---

## Database Notes
- Backend targets MySQL. The `supabase/migrations/` folder contains SQL migrations for reference (Postgres-style). If using MySQL, create analogous tables based on comments in `backend/README.md` and the data shapes in `src/types/index.ts`.

Core tables expected:
- `users` (id, username, email, password, role, status, date_joined, ...)
- `spaces` (id, owner_id, type, title, location, rate_per_hour, description, availability, dimensions JSON)
- `interests` (id, user_id, space_id, hours_requested, status, host_response_date, timestamp)
- `reports` (id, reporter_id, reported_id, reporter_role, reported_role, reason, timestamp)
- `pending_hosts` (id, username, email, nid_image, date_applied)

---

## Troubleshooting
- Backend 500/DB errors: verify MySQL is running and credentials in `backend/main.py` are correct.
- 401/404 responses: many endpoints are stubs; implement SQL in `backend/main.py` per function docstrings.
- CORS errors: ensure backend runs on port 8000 and CORS allows `http://localhost:5173`.
- Port conflicts: change ports via `uvicorn` or Vite config if needed.

---

## License
Proprietary — internal project scaffolding for JIRAO.


