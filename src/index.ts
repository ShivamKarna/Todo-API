import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { Scalar } from "@scalar/hono-api-reference";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { todoRouter } from "./modules/todos/todos.routes";
import { rateLimit } from "./middleware/rateLimiter.middleware";
import { createAuth } from "./lib/auth";
import type { BindingsType, VariablesType } from "./types";

const app = new OpenAPIHono<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>();

app.use("/*", logger());
app.use("/*", async (c, next) => {
  return cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://todo.shivamkarn.workers.dev",
      "https://doloop.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(c, next);
});

app.use("/api/*", rateLimit);

app.get("/", (c) =>
  c.json({
    service: "todo-api",
    status: "ok",
  }),
);

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env.todo_db, c.env);
  return auth.handler(c.req.raw);
});

// ROUTES ARE HERE
app.route("/api/todo", todoRouter);

app.doc("/docs/json", {
  openapi: "3.0.0",
  info: {
    title: "Todo API",
    version: "1.0",
    description: "A simple todo API",
    contact: { email: "contact@shivam-karn.com.np" },
  },
  servers: [
    {
      url: "https://todo.shivamkarn.workers.dev",
      description: "Production",
    },
    { url: "http://localhost:8787", description: "Local" },
  ],
});

app.get(
  "/docs",
  swaggerUI({
    url: "/docs/json",
  }),
);

app.get("/reference", async (c, next) => {
  if (c.env.ENVIRONMENT === "production") {
    return c.notFound();
  }
  return Scalar<{ Bindings: BindingsType; Variables: VariablesType }>({
    url: "/docs/json",
    theme: "kepler",
    // alternate
    // default
    // moon
    // purple
    // solarized
    // kepler
    // mars
    // saturn
  })(c, next);
});

app.onError((err, c) => {
  console.error(`[ERROR] ${err.message}`);
  if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message }, err.status);
  }
  return c.json(
    { success: false, error: err.message ?? "Internal Server Error" },
    500,
  );
});

app.notFound((c) => c.json({ success: false, error: "Route not found" }, 404));

export default app;
