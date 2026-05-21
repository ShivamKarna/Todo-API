import { createMiddleware } from "hono/factory";
import { BindingsType } from "../types";
import { success } from "zod";

const LIMIT = 110;
const WINDOW = 60;

export const rateLimit = createMiddleware<{ Bindings: BindingsType }>(
  async (c, next) => {
    const ip = c.req.header("cf-connecting-ip") ?? "unknown";

    const key = `rateLimit:${ip}`;

    try {
      const current = await c.env.TODO_KV.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= LIMIT) {
        return c.json({ success: false, message: "Too many requests" }, 429);
      }

      await c.env.TODO_KV.put(key, String(count + 1), {
        expirationTtl: WINDOW,
      });
    } catch (err) {
      console.error(`[RateLimiter] KV Error: ${err}`);
      // Fallback: allow the request to proceed if KV storage is temporarily unavailable
    }

    await next();
  },
);
