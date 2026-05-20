import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import type { BindingsType } from "../types";

export const createAuth = (
  db: D1Database,
  bindings: Pick<
    BindingsType,
    | "GOOGLE_CLIENT_ID"
    | "GOOGLE_CLIENT_SECRET"
    | "BETTER_AUTH_SECRET"
    | "BETTER_AUTH_URL"
  >,
) => {
  const drizzleDb = drizzle(db);

  return betterAuth({
    database: drizzleAdapter(drizzleDb, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret: bindings.BETTER_AUTH_SECRET,
    baseURL: bindings.BETTER_AUTH_URL,
    trustedOrigins: [
      "http://localhost:8787",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://todo.shivamkarn.workers.dev",
    ],
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      google: {
        clientId: bindings.GOOGLE_CLIENT_ID,
        clientSecret: bindings.GOOGLE_CLIENT_SECRET,
      },
    },
  });
};
