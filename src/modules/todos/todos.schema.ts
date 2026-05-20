import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const todoSchema = z
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

export const listTodosQuerySchema = z
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

export const todoIdParamsSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .openapi({ example: "2bdbbe7b-0c42-4e53-9f95-0f7b2f0b3f18" }),
  })
  .openapi("TodoIdParams");

export const todoListResponseSchema = z
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

export const todoSingleResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    data: todoSchema,
  })
  .openapi("TodoSingleResponse");

export const todoMutationResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Todo updated successfully" }),
    data: todoSchema.nullable().optional(),
  })
  .openapi("TodoMutationResponse");

export const authErrorResponseSchema = z
  .object({
    error: z.string().openapi({ example: "Sign In Required" }),
    code: z.string().openapi({ example: "UNAUTHORIZED" }),
  })
  .openapi("AuthErrorResponse");

export const notFoundResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Todo not found" }),
  })
  .openapi("NotFoundResponse");

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
