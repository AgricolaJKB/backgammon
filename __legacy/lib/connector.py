import sqlite3
import time

DB_PATH = "db/database.db"


# get human readable timestamp
def get_timestamp():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


class Connector:
    def __init__(self, id):
        self.id = id
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row

    def __del__(self):
        if hasattr(self, "conn"):
            self.conn.close()

    def get(self):
        cursor = self.conn.cursor()

        cursor.execute(
            """
            SELECT 
                game_id as id, 
                turn_number as turn, 
                player_color as player, 
                checker_id, 
                from_pos as start, 
                to_pos as end, 
                moved_at as timestamp 
            FROM moves 
            WHERE game_id = ?
            """,
            (self.id,),
        )
        moves = [dict(row) for row in cursor.fetchall()]

        cursor.execute(
            """
            SELECT 
                game_id as id, 
                turn_number as turn, 
                player_color as player, 
                die_1 as dice1, 
                die_2 as dice2, 
                rolled_at as timestamp 
            FROM dice_rolls 
            WHERE game_id = ?
            """,
            (self.id,),
        )
        throws = [dict(row) for row in cursor.fetchall()]

        return {
            "moves": moves,
            "throws": throws,
        }

    def get_last_player(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT player_color FROM moves WHERE game_id = ? ORDER BY id DESC LIMIT 1",
            (self.id,),
        )
        row = cursor.fetchone()
        if row:
            return row["player_color"]
        return None

    def get_last_turn(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT turn_number FROM moves WHERE game_id = ? ORDER BY id DESC LIMIT 1",
            (self.id,),
        )
        row = cursor.fetchone()
        if row:
            return row["turn_number"]
        return 0

    def add_move(self, id, turn, player, checker_id, start, end):
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO moves (game_id, turn_number, player_color, checker_id, from_pos, to_pos, moved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            (id, turn, player, checker_id, start, end, get_timestamp()),
        )
        self.conn.commit()

    def add_throw(self, id, turn, player, dice1, dice2):
        cursor = self.conn.cursor()
        # check if already exists
        cursor.execute(
            "SELECT 1 FROM dice_rolls WHERE game_id = ? AND turn_number = ?", (id, turn)
        )
        if cursor.fetchone():
            return

        cursor.execute(
            """
            INSERT INTO dice_rolls (game_id, turn_number, player_color, die_1, die_2, rolled_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (id, turn, player, dice1, dice2, get_timestamp()),
        )
        self.conn.commit()

