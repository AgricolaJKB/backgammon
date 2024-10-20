import pandas as pd
import time


# get human readable timestamp
def get_timestamp():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


class Connector:
    def __init__(self, id):
        self.id = id
        self.moves = pd.read_csv("db/moves.csv")
        self.throws = pd.read_csv("db/throws.csv")

        self.moves = self.moves[self.moves["id"] == id]
        self.throws = self.throws[self.throws["id"] == id]

    def get(self):
        return {
            "moves": self.moves.to_dict(orient="records"),
            "throws": self.throws.to_dict(orient="records"),
        }

    def get_last_player(self):
        if self.moves.empty:
            return None
        return self.moves.iloc[-1]["player"]

    def get_last_turn(self):
        if self.moves.empty:
            return 0
        return self.moves.iloc[-1]["turn"]

    def add_move(self, id, turn, player, checker_id, start, end):
        self.moves = self.moves._append(
            {
                "id": id,
                "turn": turn,
                "player": player,
                "checker_id": checker_id,
                "start": start,
                "end": end,
                "timestamp": get_timestamp(),
            },
            ignore_index=True,
        )
        self.moves.to_csv("db/moves.csv", index=False)

    def add_throw(self, id, turn, player, dice1, dice2):
        # check if already exists
        if not self.throws[
            (self.throws["id"] == id) & (self.throws["turn"] == turn)
        ].empty:
            return
        self.throws = self.throws._append(
            {
                "id": id,
                "turn": turn,
                "player": player,
                "dice1": dice1,
                "dice2": dice2,
                "timestamp": get_timestamp(),
            },
            ignore_index=True,
        )
        self.throws.to_csv("db/throws.csv", index=False)
