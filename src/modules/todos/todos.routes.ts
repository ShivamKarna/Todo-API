/** /api/todo */

import { BindingsType, VariablesType } from "../../types";
import { todoHandler } from "./todos.handlers";
import { createTodoSchema, updateTodoSchema } from "./todos.schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

export const todoRouter = new OpenAPIHono<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>();

todoRouter.use("*", requireAuth);

const todoSchema = z
  .object({
    id: z.string().openapi({ example: "2bdbbe7b-0c42-4e53-9f95-0f7b2f0b3f18" }),
    userId: z
      .string()
      .openapi({ example: "3c709f0c-6e28-4a9a-9d8f-8f742b6a3b77" }),
    title: z.string().min(1).max(255).openapi({ example: "Buy groceries" }),
    description: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Milk, eggs, bread" }),
    completed: z.boolean().nullable().openapi({ example: false }),
    dueDate: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .openapi({ example: "2026-06-01T10:00:00.000Z" }),
    completedAt: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "2026-06-01T12:00:00.000Z" }),
    priority: z
      .enum(["low", "medium", "high"])
      .nullable()
      .openapi({ example: "medium" }),
    deletedAt: z
      .date()
      .nullable()
      .optional()
      .openapi({ example: "2026-05-20T08:30:00.000Z" }),
    createdAt: z.date().openapi({ example: "2026-05-20T08:30:00.000Z" }),
    updatedAt: z.date().openapi({ example: "2026-05-20T08:30:00.000Z" }),
  })
  .openapi("Todo");

const listTodosQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .openapi({ example: 10 }),
    completed: z
      .enum(["true", "false"])
      .optional()
      .openapi({ example: "false" }),
    q: z.string().min(1).optional().openapi({ example: "groceries" }),
  })
  .openapi("TodoListQuery");

const todoIdParamsSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .openapi({ example: "2bdbbe7b-0c42-4e53-9f95-0f7b2f0b3f18" }),
  })
  .openapi("TodoIdParams");

const todoListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    data: z.array(todoSchema),
    meta: z.object({
      page: z.number().int().openapi({ example: 1 }),
      limit: z.number().int().openapi({ example: 10 }),
      total: z.number().int().openapi({ example: 25 }),
      totalPages: z.number().int().openapi({ example: 3 }),
      hasMore: z.boolean().openapi({ example: true }),
    }),
  })
  .openapi("TodoListResponse");

const todoSingleResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    data: z.array(todoSchema),
  })
  .openapi("TodoSingleResponse");

const todoMutationResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Todo updated successfully" }),
    data: todoSchema.nullable().optional(),
  })
  .openapi("TodoMutationResponse");

const authErrorResponseSchema = z
  .object({
    error: z.string().openapi({ example: "Sign In Required" }),
    code: z.string().openapi({ example: "UNAUTHORIZED" }),
  })
  .openapi("AuthErrorResponse");

const notFoundResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Todo not found" }),
  })
  .openapi("NotFoundResponse");

todoRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Todo"],
    summary: "List todos",
    request: {
      query: listTodosQuerySchema,
    },
    responses: {
      200: {
        description: "Todo list",
        content: {
          "application/json": {
            schema: todoListResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: authErrorResponseSchema,
          },
        },
      },
    },
  }),

  todoHandler.getTodos,
);

todoRouter.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    tags: ["Todo"],
    summary: "Get todo by id",
    request: {
      params: todoIdParamsSchema,
    },
    responses: {
      200: {
        description: "Todo found",
        content: {
          "application/json": {
            schema: todoSingleResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: authErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: notFoundResponseSchema,
          },
        },
      },
    },
  }),
  todoHandler.getTodoById,
);

todoRouter.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Todo"],
    summary: "Create todo",
    request: {
      body: {
        content: {
          "application/json": {
            schema: createTodoSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Todo created",
        content: {
          "application/json": {
            schema: todoMutationResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: authErrorResponseSchema,
          },
        },
      },
    },
  }),
  todoHandler.createTodo,
);

todoRouter.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags: ["Todo"],
    summary: "Update todo",
    request: {
      params: todoIdParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateTodoSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Todo updated",
        content: {
          "application/json": {
            schema: todoMutationResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: authErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: notFoundResponseSchema,
          },
        },
      },
    },
  }),
  todoHandler.updateTodo,
);

todoRouter.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags: ["Todo"],
    summary: "Delete todo",
    request: {
      params: todoIdParamsSchema,
    },
    responses: {
      200: {
        description: "Todo deleted",
        content: {
          "application/json": {
            schema: todoMutationResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: authErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: notFoundResponseSchema,
          },
        },
      },
    },
  }),
  todoHandler.deleteTodo,
);
