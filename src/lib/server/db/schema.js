import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const user = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").unique().notNull(),
  emoji: text("emoji").notNull()
});

export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  whitePlayerId: text("white_player_id").notNull().references(() => user.id),
  blackPlayerId: text("black_player_id").notNull().references(() => user.id),
  winnerId: text("winner_id").references(() => user.id),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const moves = sqliteTable("moves", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: text("game_id").notNull().references(() => games.id),
  turnNumber: integer("turn_number").notNull(),
  playerColor: text("player_color").notNull(),
  checkerId: integer("checker_id").notNull(),
  fromPos: integer("from_pos").notNull(),
  toPos: integer("to_pos").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const diceRolls = sqliteTable("dice_rolls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: text("game_id").notNull().references(() => games.id),
  turnNumber: integer("turn_number").notNull(),
  playerColor: text("player_color").notNull(),
  dice1: integer("dice_1").notNull(),
  dice2: integer("dice_2").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const friendships = sqliteTable("friendships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: text("sender_id").notNull().references(() => user.id),
  receiverId: text("receiver_id").notNull().references(() => user.id),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
