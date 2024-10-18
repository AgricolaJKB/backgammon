import random


def roll_dice():
    return random.randint(1, 6)


def get_player(turn):
    return "w" if turn % 2 == 0 else "b"
