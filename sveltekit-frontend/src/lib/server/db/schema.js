import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("user_id").primaryKey(),
  username: text("user_name").notNull().unique(),
  passwordHash: text("user_pwd_hash").notNull(),
  mail: text("user_mail").unique()
});
