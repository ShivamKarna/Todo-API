import { Context } from "hono";
import { BindingsType, VariablesType } from "../../types";
import { getDb } from "../../db";
import { todos } from "../../db/schema";
import { and, count, eq, isNull, like } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { CreateTodoInput, UpdateTodoInput } from "./todos.schema";

type AppContext = Context<{ Bindings: BindingsType; Variables: VariablesType }>;

type QueryParams = Record<string, string | undefined>;

export const getPagination = (query: QueryParams) => {
  const rawPage = query.page;
  const rawLimit = query.limit;

  const page = Math.max(
    1,
    Number.isFinite(Number(rawPage)) ? Number(rawPage) : 1,
  );
  const limit = Math.min(
    50,
    Math.max(1, Number.isFinite(Number(rawLimit)) ? Number(rawLimit) : 10),
  );

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};

class TodoHandler {
  getTodos = async (c: AppContext) => {
    const db = getDb(c.env.todo_db);
    const user = c.get("user");
    const { page, limit, offset } = getPagination(c.req.query());
    const completedParam = c.req.query("completed");
    const q = c.req.query("q");

    const filters: SQL[] = [eq(todos.userId, user.id), isNull(todos.deletedAt)];

    // with filter to return completed
    if (completedParam !== undefined) {
      filters.push(eq(todos.completed, completedParam === "true"));
    }

    // with search built it, all in one vagelai getTodos
    if (q && q.trim().length > 0) {
      filters.push(like(todos.title, `%${q}%`));
    }

    const [result, [countRow]] = await Promise.all([
      db
        .select()
        .from(todos)
        .where(and(...filters))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(todos)
        .where(and(...filters)),
    ]);

    const total = Number(countRow.total);

    return c.json(
      {
        success: true,
        data: result,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
      200,
    );
  };
  getTodoById = async (c: AppContext) => {
    const db = getDb(c.env.todo_db);
    const todoId = c.req.param("id");
    const user = c.get("user");

    if (!todoId) {
      throw new HTTPException(404, { message: "Todo not found" });
    }

    const result = await db
      .select()
      .from(todos)
      .where(
        and(
          eq(todos.id, todoId),
          eq(todos.userId, user.id),
          isNull(todos.deletedAt),
        ),
      )
      .get();

    if (!result) throw new HTTPException(404, { message: "Todo not found" });

    return c.json({ success: true, data: result }, 200);
  };
  createTodo = async (c: AppContext) => {
    const db = getDb(c.env.todo_db);
    const user = c.get("user");
    const body = (await c.req.json()) as CreateTodoInput;

    const [created] = await db
      .insert(todos)
      .values({
        userId: user.id,
        title: body.title,
        description: body.description,
        dueDate: body.dueDate,
        priority: body.priority,
      })
      .returning();

    return c.json(
      { success: true, message: "Todo created successfully", data: created },
      201,
    );
  };

  updateTodo = async (c: AppContext) => {
    const db = getDb(c.env.todo_db);
    const todoId = c.req.param("id");
    const user = c.get("user");
    const body = (await c.req.json()) as UpdateTodoInput;

    if (!todoId) {
      throw new HTTPException(404, { message: "Todo not found" });
    }

    const [updated] = await db
      .update(todos)
      .set({
        ...body,
        completedAt:
          body.completed === true
            ? new Date().toISOString()
            : body.completed === false
              ? null
              : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(todos.id, todoId),
          eq(todos.userId, user.id),
          isNull(todos.deletedAt),
        ),
      )
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: "Todo not found" });
    }

    return c.json(
      { success: true, message: "Todo updated successfully", data: updated },
      200,
    );
  };
  deleteTodo = async (c: AppContext) => {
    const db = getDb(c.env.todo_db);
    const todoId = c.req.param("id");
    if (!todoId) {
      throw new HTTPException(404, { message: "Todo not found" });
    }
    const user = c.get("user");

    const result = await db
      .update(todos)
      .set({ deletedAt: new Date() })
      .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
      .returning();

    if (result.length === 0) {
      throw new HTTPException(404, {
        message: "Todo not found",
      });
    }
    return c.json({ success: true, message: "Todo deleted successfully" }, 200);
  };
}

export const todoHandler = new TodoHandler();
