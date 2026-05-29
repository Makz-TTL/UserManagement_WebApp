import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const likesTable = sqliteTable("likes", {
    
    id: integer().primaryKey({autoIncrement: true}),
   
    userId: integer().notNull(),

    postId: integer().notNull(),

    like: integer({mode: "boolean"}).notNull()
})

export type Like =  typeof likesTable.$inferSelect