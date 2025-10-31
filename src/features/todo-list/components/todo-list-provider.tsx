import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Todo } from '../data/schema';

interface TodoListContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentTodo: Todo | null;
  setCurrentTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
}

const TodoListContext = createContext<TodoListContextType | undefined>(undefined);

interface TodoListProviderProps {
  initialTodos: Todo[];
  children: ReactNode;
}

export const TodoListProvider: React.FC<TodoListProviderProps> = ({ initialTodos, children }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: `todo-${Date.now()}`,
      createdAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
    setIsAddDialogOpen(false);
  };

  const updateTodo = (id: string, todo: Partial<Todo>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...todo } : t)));
    setIsEditDialogOpen(false);
    setCurrentTodo(null);
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TodoListContext.Provider
      value={{
        todos,
        setTodos,
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        currentTodo,
        setCurrentTodo,
        addTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoListContext.Provider>
  );
};

export const useTodoList = (): TodoListContextType => {
  const context = useContext(TodoListContext);
  if (context === undefined) {
    throw new Error('useTodoList must be used within a TodoListProvider');
  }
  return context;
};