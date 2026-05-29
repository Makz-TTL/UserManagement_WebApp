import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users", {
  //id
  id: integer().primaryKey({autoIncrement: true}),
  //name
  name: text().notNull(),
  //userName
  userName: text().notNull().unique(),
  //lastName
  lastName: text().notNull(),
  //email
  email: text().notNull().unique(),
  //phone
  phone: integer(),
  //password
  password: text().notNull(),
  //
  cookie: text()
})

export type User =  typeof usersTable.$inferSelect