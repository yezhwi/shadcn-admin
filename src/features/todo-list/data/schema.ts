import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  createdAt: z.date().default(() => new Date()),
});

export type Todo = z.infer<typeof todoSchema>;