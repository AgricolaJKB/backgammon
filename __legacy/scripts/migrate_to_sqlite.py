import sqlite3
import pandas as pd
import os

DB_PATH = "db/database.db"
CSV_DIR = "db"


def create_tables(conn):
    cursor = conn.cursor()

    # Moves table
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS moves (
        id TEXT,
        turn INTEGER,
        player TEXT,
        checker_id TEXT,
        start TEXT,
        end TEXT,
        timestamp TEXT
    )
    """
    )

    # Throws table
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS throws (
        id TEXT,
        turn INTEGER,
        player TEXT,
        dice1 INTEGER,
        dice2 INTEGER,
        timestamp TEXT
    )
    """
    )

    # Players table
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS players (
        id TEXT,
        player TEXT,
        mail TEXT
    )
    """
    )

    conn.commit()
    print("Tables created successfully.")


def migrate_data(conn):
    # Migrate moves
    if os.path.exists(f"{CSV_DIR}/moves.csv"):
        df_moves = pd.read_csv(f"{CSV_DIR}/moves.csv")
        df_moves.to_sql("moves", conn, if_exists="replace", index=False)
        print(f"Migrated {len(df_moves)} moves.")

    # Migrate throws
    if os.path.exists(f"{CSV_DIR}/throws.csv"):
        df_throws = pd.read_csv(f"{CSV_DIR}/throws.csv")
        df_throws.to_sql("throws", conn, if_exists="replace", index=False)
        print(f"Migrated {len(df_throws)} throws.")

    # Migrate players
    if os.path.exists(f"{CSV_DIR}/players.csv"):
        df_players = pd.read_csv(f"{CSV_DIR}/players.csv")
        df_players.to_sql("players", conn, if_exists="replace", index=False)
        print(f"Migrated {len(df_players)} players.")


if __name__ == "__main__":
    # Ensure we are in the backend directory
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}. Please run from backend directory.")
        exit(1)

    conn = sqlite3.connect(DB_PATH)
    create_tables(conn)
    migrate_data(conn)
    conn.close()
