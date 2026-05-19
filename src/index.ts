import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello this is todo backend");
});

export default app;
