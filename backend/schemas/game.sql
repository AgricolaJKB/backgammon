CREATE TABLE IF NOT EXISTS moves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL REFERENCES games(id),
    turn_number INTEGER NOT NULL,
    player_color TEXT NOT NULL CHECK(player_color IN ('white', 'black')),
    checker_id INTEGER NOT NULL,
    from_pos INTEGER NOT NULL,
    to_pos INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dice_rolls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL REFERENCES games(id),
    turn_number INTEGER NOT NULL,
    player_color TEXT NOT NULL CHECK(player_color IN ('white', 'black')),
    dice_1 INTEGER NOT NULL CHECK(dice_1 BETWEEN 1 AND 6),
    dice_2 INTEGER NOT NULL CHECK(dice_2 BETWEEN 1 AND 6),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY NOT NULL,
    white_player_id TEXT NOT NULL REFERENCES users(id),
    black_player_id TEXT NOT NULL REFERENCES users(id),
    winner_id TEXT REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moves_game_id ON moves(game_id);
CREATE INDEX IF NOT EXISTS idx_dice_rolls_game_id ON dice_rolls(game_id);
