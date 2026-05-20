import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export type BindingsType = {
  todo_db: D1Database;
  TODO_KV: KVNamespace;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  ENVIRONMENT: string;
};

type BetterAuthFactory = typeof import("better-auth").betterAuth;
type BetterAuthInstance = ReturnType<BetterAuthFactory>;
export type AuthSessionResult = Awaited<
  ReturnType<BetterAuthInstance["api"]["getSession"]>
>;

export type AuthUser = NonNullable<AuthSessionResult>["user"];
export type AuthSession = NonNullable<AuthSessionResult>["session"];

export type VariablesType = {
  user: AuthUser;
  session: AuthSession;
};
