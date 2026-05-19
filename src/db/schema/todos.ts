import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./users";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
};

export const todos = sqliteTable(
  "todos",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    completed: integer("completed", { mode: "boolean" }).default(false),
    dueDate: text("due_date"),
    completedAt: text("completed_at"),
    priority: text("priority", { enum: ["low", "medium", "high"] }).default(
      "medium",
    ),
    deletedAt: integer("deleted_at", {
      mode: "timestamp_ms",
    }),
    ...timestamps,
  },
  (table) => [index("index_on_todos_userId").on(table.userId)],
);
