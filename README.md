# Grow Higher - Local dev notes

This project runs a FastAPI backend and a Next.js frontend. By default the backend uses a local SQLite file `app.db`. If you'd like to use PostgreSQL for persistence (so web UI and DB align), follow these steps:

1. Install Postgres and create a database.
2. Install DB driver in the project's venv:

   C:/Users/JoswaDhanaraj/Documents/fast-api/.venv/Scripts/python.exe -m pip install psycopg2-binary

3. Set the DATABASE_URL environment variable (Windows PowerShell example):

   $env:DATABASE_URL = 'postgresql://user:password@localhost:5432/growhigher'

4. Run the migration script to copy data from local sqlite `app.db` into Postgres:

   C:/Users/JoswaDhanaraj/Documents/fast-api/.venv/Scripts/python.exe migrate_sqlite_to_postgres.py

5. Start the backend; it will now use Postgres:

   C:/Users/JoswaDhanaraj/Documents/fast-api/.venv/Scripts/python.exe -m uvicorn main:app --reload

Make sure to stop any running uvicorn instance before changing DATABASE_URL.

## Quick local dev (Windows PowerShell)

1. Create and activate a Python virtual environment in the project root:

   powershell
   python -m venv .\.venv
   .\.venv\Scripts\Activate.ps1

2. Install Python dependencies:

   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt

3. Create tables and seed a test product:

   # create tables
   python create_tables.py

   # insert a test product (uses models.py -> products table)
   python insert_test_product.py

4. Start the backend (FastAPI / uvicorn):

   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

5. Start the frontend (in a separate terminal):

   cd frontend
   npm install
   npm run dev

Frontend expects the API at http://127.0.0.1:8000 by default. If you run the API elsewhere, set `NEXT_PUBLIC_API_URL` in your environment or in `.env.local` inside the `frontend` folder.

If you prefer a single command, the top-level `package.json` includes a `start` script that runs the API and web concurrently, but it assumes `concurrently` is installed and a `.venv` exists and is activated.
