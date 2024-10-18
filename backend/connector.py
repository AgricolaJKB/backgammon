import pandas as pd
import time


# get human readable timestamp
def get_timestamp():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


class Connector:
    def __init__(self, id):
        self.id = id
        self.turns = pd.read_csv("db/turns.csv")
        self.throws = pd.read_csv("db/throws.csv")

    def get(self, id):
        _turns = self.turns[self.turns["id"] == id]
        _throws = self.throws[self.throws["id"] == id]
        return {
            "turns": _turns.to_dict(orient="records"),
            "throws": _throws.to_dict(orient="records"),
        }

    def add_turn(self, id, turn, player, state):
        # check if already exists
        if not self.turns[
            (self.turns["id"] == id) & (self.turns["turn"] == turn)
        ].empty:
            return
        self.turns = self.turns._append(
            {
                "id": id,
                "turn": turn,
                "time": player,
                "state": state,
                "timestamp": get_timestamp(),
            },
            ignore_index=True,
        )
        self.turns.to_csv("db/turns.csv", index=False)

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
