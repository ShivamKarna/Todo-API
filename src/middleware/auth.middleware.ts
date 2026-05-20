import { createMiddleware } from "hono/factory";
import type { AuthSessionResult, BindingsType, VariablesType } from "../types";
import { createAuth } from "../lib/auth";

const isSessionValid = (
  session: AuthSessionResult | null | undefined,
): session is NonNullable<AuthSessionResult> =>
  Boolean(session?.user && session?.session);

export const requireAuth = createMiddleware<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>(async (c, next) => {
  const auth = createAuth(c.env.todo_db, c.env);

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!isSessionValid(session)) {
    return c.json({ error: "Sign In Required", code: "UNAUTHORIZED" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});

// i don't think e use hetai, but for future maybe
export const optionalAuth = createMiddleware<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>(async (c, next) => {
  const auth = createAuth(c.env.todo_db, c.env);

  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (isSessionValid(session)) {
      c.set("user", session.user);
      c.set("session", session.session);
    }
  } catch (error) {
    if (c.env.ENVIRONMENT === "development") console.error(error);
  }
  await next();
});
