import { TodoListMutateDrawer } from './todo-list-mutate-drawer';
import { useTodoList } from './todo-list-provider';

export function TodoListDialogs() {
  const { isAddDialogOpen, setIsAddDialogOpen, isEditDialogOpen, setIsEditDialogOpen, currentTodo, setCurrentTodo } = useTodoList();

  return (
    <>
      <TodoListMutateDrawer
        key='todo-add'
        open={isAddDialogOpen}
        onOpenChange={(open) => setIsAddDialogOpen(open)}
      />

      {currentTodo && (
        <TodoListMutateDrawer
          key={`todo-edit-${currentTodo.id}`}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setTimeout(() => setCurrentTodo(null), 500);
            }
          }}
          currentTodo={currentTodo}
        />
      )}
    </>
  );
}