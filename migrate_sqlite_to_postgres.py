"""
Simple migration helper: copy data from local sqlite `app.db` to a target DATABASE_URL (Postgres).
Usage:
  set DATABASE_URL=postgresql://user:pass@host:port/dbname
  python migrate_sqlite_to_postgres.py

This script will copy `users` and `products` tables if they exist. It requires `psycopg2-binary` installed for Postgres.
"""
from sqlalchemy import create_engine, text
import os

SRC_SQLITE = os.getenv("SRC_SQLITE", "sqlite:///./app.db")
DEST = os.getenv("DATABASE_URL")

if not DEST:
    print("Please set DATABASE_URL to your Postgres database and rerun.")
    raise SystemExit(1)

# engines
src_engine = create_engine(SRC_SQLITE, connect_args={"check_same_thread": False})
dest_engine = create_engine(DEST)

def ensure_tables(conn):
    # Create minimal tables in Postgres if they don't exist. Match main.py models.
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DOUBLE PRECISION NOT NULL,
      quantity INTEGER NOT NULL
    )
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      role TEXT NOT NULL
    )
    """))

with src_engine.connect() as sconn, dest_engine.connect() as dconn:
    print("Ensuring destination tables exist...")
    ensure_tables(dconn)

    for table_name in ["products", "users"]:
        try:
            rows = sconn.execute(text(f"SELECT * FROM {table_name}")).mappings().all()
        except Exception as e:
            print(f"Source table {table_name} not found or error reading it: {e}")
            continue

        if not rows:
            print(f"No rows in {table_name}, skipping")
            continue

        inserted = 0
        for r in rows:
            # Build insert statement based on available keys
            cols = [k for k in r.keys() if k != "id"]
            col_list = ",".join(cols)
            val_placeholders = ",".join([f":{c}" for c in cols])
            insert_sql = text(f"INSERT INTO {table_name} ({col_list}) VALUES ({val_placeholders}) ON CONFLICT DO NOTHING")
            params = {c: r[c] for c in cols}
            try:
                dconn.execute(insert_sql, params)
                inserted += 1
            except Exception as e:
                print(f"Failed to insert row into {table_name}: {e}")
        dconn.commit()
        print(f"Migrated {inserted} rows into {table_name}")

print("Done")
