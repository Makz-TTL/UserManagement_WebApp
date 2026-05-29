import { defineRelations } from "drizzle-orm"
import { usersTable } from "./users"
import { postsTable } from "./post"
import {likesTable} from "./likes"

export default defineRelations({ usersTable, postsTable, likesTable }, (r) => ({
  usersTable: {
    posts: r.many.postsTable()
  },
  LikesTable: {
    users: r.many.usersTable(),
    posts: r.many.postsTable()
  },

  //idauthor connected to id in usersTable
  postsTable: {
    author: r.one.usersTable({
      from: r.postsTable.authorId,
      to: r.usersTable.id

    })
  },
  
  likesTable: {
    user: r.one.usersTable({
      from: r.likesTable.userId,
      to: r.usersTable.id
    }),
    post: r.one.postsTable({
      from: r.likesTable.postId,
      to: r.postsTable.id
    })
  }



}))
  