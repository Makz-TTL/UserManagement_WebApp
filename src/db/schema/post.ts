import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { usersTable } from "./users"

export const postsTable = sqliteTable("posts", {    
    //id    
    id: integer().primaryKey({autoIncrement: true}),
    //userId
    authorId: integer().notNull().references(() => usersTable.id),
    //title
    title: text().notNull(),
    //content
    content: text().notNull(),
    //immagine
    image: text()
})

export type Post =  typeof postsTable.$inferSelect
