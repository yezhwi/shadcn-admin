import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTodoList } from './todo-list-provider';

export function TodoListPrimaryButtons() {
  const { setIsAddDialogOpen } = useTodoList();
  return (
    <Button className='space-x-1' onClick={() => setIsAddDialogOpen(true)}>
      <span>Add Todo</span> <Plus size={18} />
    </Button>
  );
}