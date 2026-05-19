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

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
