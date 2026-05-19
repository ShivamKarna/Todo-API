import { Hono } from "hono";
import { todoRouter } from "./modules/todos/todos.routes";

const app = new Hono();

app.route("/api/todo", todoRouter);

app.get("/", (c) => {
  return c.text("Hello this is todo backend");
});

export default app;
