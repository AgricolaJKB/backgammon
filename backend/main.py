from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from lib.connector import Connector
from lib.models import Move
from lib.utils import roll_dice, get_player
from lib.mail import notify

origins = [
    "http://localhost:4173",
    "http://localhost:5173",
    "https://agricolajkb.github.io",
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


@app.get("/{id}")
def read_game(id: str):
    conn = Connector(id)
    return conn.get()


@app.get("/{id}/roll")
def roll(id: str):
    conn = Connector(id)
    player = conn.get_last_player() == "w" and "b" or "w"
    turn = conn.get_last_turn() + 1
    dice1 = roll_dice()
    dice2 = roll_dice()
    conn.add_throw(id, turn, player, dice1, dice2)
    return conn.get()


@app.post("/{id}/moves")
def add_moves(id: str, moves: List[Move]):
    conn = Connector(id)
    turn = conn.get_last_turn() + 1
    player = conn.get_last_player() == "w" and "b" or "w"
    for move in moves:
        conn.add_move(id, turn, player, move.checker_id, move.start, move.end)
    return "ok"
