/** /api/todo */

import { BindingsType, VariablesType } from "../../types";
import { todoHandler } from "./todos.handlers";
import { createTodoSchema, updateTodoSchema } from "./todos.schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  listTodosQuerySchema,
  todoIdParamsSchema,
  todoListResponseSchema,
  todoSingleResponseSchema,
  todoMutationResponseSchema,
  authErrorResponseSchema,
  notFoundResponseSchema,
} from "./todos.schema";

export const todoRouter = new OpenAPIHono<{
  Bindings: BindingsType;
  Variables: VariablesType;
}>();

todoRouter.use("*", requireAuth);
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
