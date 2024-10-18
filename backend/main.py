from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from connector import Connector
from utils import roll_dice, get_player

origins = [
    "http://localhost",
    "http://localhost:5173",
]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/game/{id}")
def read_game(id: str):
    conn = Connector(id)
    return conn.get(id)


@app.get("/game/{id}/roll")
def roll(id: str):
    conn = Connector(id)
    game = conn.get(id)
    turn = len(game["turns"])
    player = get_player(turn)
    dice1 = roll_dice()
    dice2 = roll_dice()
    conn.add_throw(id, turn, player, dice1, dice2)
    return conn.get(id)


@app.post("/game/{id}/turn")
def add_turn(id: str, turn: str, state: str):
    conn = Connector(id)
    conn.add_turn(id, turn, get_player(turn), state)
    return conn.get(id)


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}
