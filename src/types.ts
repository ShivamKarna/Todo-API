import type { D1Database, KVNamespace, Queue } from "@cloudflare/workers-types";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
};

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
export type Variables = {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};
