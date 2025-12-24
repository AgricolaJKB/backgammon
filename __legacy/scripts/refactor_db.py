import sqlite3
import os

DB_PATH = "backend/db/database.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Migrate user table to users
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user'")
    if cursor.fetchone():
        print("Migrating user table to users...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                email TEXT UNIQUE
            )
        """)
        # Copy data if users table was just created or empty
        # We assume users table is the target.
        try:
            cursor.execute("INSERT INTO users (id, username, password_hash, email) SELECT user_id, user_name, user_pwd_hash, user_mail FROM user")
            print("Data copied.")
        except sqlite3.IntegrityError:
            print("Data might already exist in users table.")
        
        cursor.execute("DROP TABLE user")
        print("Old user table dropped.")
    else:
        print("Table 'user' not found (maybe already migrated).")

    # 2. Remove players table
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='players'")
    if cursor.fetchone():
        print("Removing players table...")
        cursor.execute("DROP TABLE players")
    
    # 3. Create games table
    print("Creating games table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            white_player_id TEXT REFERENCES users(id),
            black_player_id TEXT REFERENCES users(id),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            config TEXT
        )
    """)

    # 4. Migrate moves table
    print("Migrating moves table...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='moves'")
    if cursor.fetchone():
        # Check if old columns exist (simple check)
        cursor.execute("PRAGMA table_info(moves)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'start' in columns:
            print("Renaming moves table to moves_old...")
            cursor.execute("ALTER TABLE moves RENAME TO moves_old")
            
            print("Creating new moves table...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS moves (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    game_id TEXT NOT NULL REFERENCES games(id),
                    turn_number INTEGER NOT NULL,
                    player_color TEXT NOT NULL,
                    checker_id INTEGER NOT NULL,
                    from_pos INTEGER NOT NULL,
                    to_pos INTEGER NOT NULL,
                    moved_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            print("Copying data to new moves table...")
            cursor.execute("""
                INSERT INTO moves (game_id, turn_number, player_color, checker_id, from_pos, to_pos, moved_at)
                SELECT id, turn, player, checker_id, start, end, timestamp FROM moves_old
            """)
            
            cursor.execute("DROP TABLE moves_old")
            print("Old moves table dropped.")
        else:
            print("Moves table seems to be already migrated.")

    # 5. Migrate throws table to dice_rolls
    print("Migrating throws table to dice_rolls...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='throws'")
    if cursor.fetchone():
        print("Renaming throws table to throws_old...")
        cursor.execute("ALTER TABLE throws RENAME TO throws_old")
        
        print("Creating dice_rolls table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS dice_rolls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id TEXT NOT NULL REFERENCES games(id),
                turn_number INTEGER NOT NULL,
                player_color TEXT NOT NULL,
                die_1 INTEGER NOT NULL,
                die_2 INTEGER NOT NULL,
                rolled_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print("Copying data to dice_rolls table...")
        cursor.execute("""
            INSERT INTO dice_rolls (game_id, turn_number, player_color, die_1, die_2, rolled_at)
            SELECT id, turn, player, dice1, dice2, timestamp FROM throws_old
        """)
        
        cursor.execute("DROP TABLE throws_old")
        print("Old throws table dropped.")
    else:
        print("Table 'throws' not found (maybe already migrated).")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
