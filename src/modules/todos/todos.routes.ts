/** /api/todo */

import { Hono } from "hono";
import { BindingsType, VariablesType } from "../../types";
import { zValidator } from "@hono/zod-validator";
import { todoHandler } from "./todos.handlers";
import { createTodoSchema, updateTodoSchema } from "./todos.schema";

const todoRouter = new Hono<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>();

todoRouter.get("/", todoHandler.getTodos);
todoRouter.post(
  "/",
  zValidator("json", createTodoSchema),
  todoHandler.createTodo,
);
todoRouter.patch(
  "/:id",
  zValidator("json", updateTodoSchema),
  todoHandler.updateTodo,
);
todoRouter.get("/:id", todoHandler.getTodoById);
todoRouter.delete("/:id", todoHandler.deleteTodo);

export { todoRouter };
