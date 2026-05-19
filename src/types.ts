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

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export type VariablesType = {
  user: AuthUser;
  session: AuthSession;
};
