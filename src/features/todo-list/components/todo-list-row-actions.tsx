import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { statusOptions } from '../data/data';
import { todoSchema } from '../data/schema';
import { useTodoList } from './todo-list-provider';

type TodoListRowActionsProps<TData> = {
  row: Row<TData>;
};

export function TodoListRowActions<TData>({ row }: TodoListRowActionsProps<TData>) {
  const todo = todoSchema.parse(row.original);
  const { setIsEditDialogOpen, setCurrentTodo, deleteTodo, updateTodo } = useTodoList();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => {
          setCurrentTodo(todo);
          setIsEditDialogOpen(true);
        }}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={todo.status} onValueChange={(value) => updateTodo(todo.id, { status: value as 'todo' | 'in-progress' | 'done' })}>
              {statusOptions.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}