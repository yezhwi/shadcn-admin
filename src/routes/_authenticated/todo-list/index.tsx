import { createFileRoute } from '@tanstack/react-router';
import { TodoList } from '@/features/todo-list';

export const Route = createFileRoute('/_authenticated/todo-list/')({
  component: TodoList,
});