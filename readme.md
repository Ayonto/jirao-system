## JIRAO

This Project is built for Database Systems (CSE370) Course, BRAC University.

### Tech stack
- Frontend: React 18, Vite 5, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn, MySQL (via `mysql-connector-python`)

### Repo layout
- `src/`: React app (components for Guest/Host/Admin, auth context, services)
- `backend/`: FastAPI app (`main.py`) with endpoint stubs and MySQL wiring
- `database/`: SQL File ( with dummy data ), database schema, databse EER diagram

---

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MySQL server (local or remote)

---

## Quick Start (Frontend + Backend)

### 1) Backend (FastAPI)
1. Create and configure a MySQL database (default expected name: `jirao_db`). Update credentials in `backend/main.py`:
   - host, database, user, password
2. Install dependencies and run the API on port 8000

PowerShell (Windows):
```powershell
cd backend
pip install -r requirements.txt

```
Start backend server 

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
OR 
```
python main.py
```

Notes:
- Test the server: `http://localhost:8000/docs` (Swagger UI) or `http://localhost:8000/api/test`.

### 2) Frontend (Vite React)
1. Install dependencies and start the dev server on port 5173

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

By default, the frontend expects the backend at `http://localhost:8000/api` (see `src/services/api.ts`).


### 3) Database ( MYSQL - XAMPP ) 
The database was developed and tested using XAMPP, hence is recommended to setup the Database using XAMPP
1. In the Database folder, `JIRAO.sql` contains the full database, structure along with dummy values.
2. Import `JIRAO.sql`, name the database `jirao_db`, as by default the backend expectes the database name `jirao_db`
3. Open XAMPP, start Apache and MySQL server.


---

## Configuration
- API base URL is hardcoded in `src/services/api.ts` as `http://localhost:8000/api`.
- CORS in `backend/main.py` allows `http://localhost:5173` by default.
- Database credentials are in `backend/main.py` within `get_db_connection()`.

---

## Features (UI)
- Guest: browse/search spaces, view details, express interest
- Host: manage listings, create/update availability, see interest counts
- Admin: user management, reports, host approval

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.


