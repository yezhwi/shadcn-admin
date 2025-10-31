import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { TodoListProvider, useTodoList } from './todo-list-provider';
import { Todo } from '../data/schema';

// Test component to consume the TodoListContext
const TestComponent: React.FC = () => {
  const { 
    todos, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    isAddDialogOpen, 
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentTodo,
    setCurrentTodo
  } = useTodoList();

  return (
    <div>
      <h1>Todo List</h1>
      <div data-testid="todo-count">{todos.length}</div>
      <button 
        data-testid="add-todo-btn"
        onClick={() => addTodo({ title: 'Test Todo', description: 'Test Description', status: 'todo' })}
      >
        Add Todo
      </button>
      <button 
        data-testid="open-add-dialog"
        onClick={() => setIsAddDialogOpen(true)}
      >
        Open Add Dialog
      </button>
      <button 
        data-testid="open-edit-dialog"
        onClick={() => {
          setCurrentTodo(todos[0]);
          setIsEditDialogOpen(true);
        }}
        disabled={todos.length === 0}
      >
        Open Edit Dialog
      </button>
      {todos.map((todo) => (
        <div key={todo.id} data-testid="todo-item">
          <span data-testid={`todo-title-${todo.id}`}>{todo.title}</span>
          <span data-testid={`todo-status-${todo.id}`}>{todo.status}</span>
          <span data-testid={`todo-created-at-${todo.id}`}>{todo.createdAt.toISOString()}</span>
          <button 
            data-testid={`update-todo-${todo.id}`}
            onClick={() => updateTodo(todo.id, { title: 'Updated Todo', status: 'done' })}
          >
            Update
          </button>
          <button 
            data-testid={`delete-todo-${todo.id}`}
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </div>
      ))}
      {isAddDialogOpen && <div data-testid="add-dialog">Add Dialog</div>}
      {isEditDialogOpen && <div data-testid="edit-dialog">Edit Dialog</div>}
      {currentTodo && <div data-testid="current-todo">{currentTodo.title}</div>}
    </div>
  );
};

describe('TodoListProvider', () => {
  const initialTodos: Todo[] = [
    {
      id: 'todo-1',
      title: 'Initial Todo 1',
      description: 'Initial Description 1',
      status: 'todo',
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 'todo-2',
      title: 'Initial Todo 2',
      description: 'Initial Description 2',
      status: 'in-progress',
      createdAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    // Mock Date.now() to return a fixed value for consistent IDs
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-03'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('provides initial todos correctly', () => {
    render(
      <TodoListProvider initialTodos={initialTodos}>
        <TestComponent />
      </TodoListProvider>
    );

    expect(screen.getByTestId('todo-count')).toHaveTextContent('2');
    expect(screen.getByTestId('todo-title-todo-1')).toHaveTextContent('Initial Todo 1');
    expect(screen.getByTestId('todo-title-todo-2')).toHaveTextContent('Initial Todo 2');
    expect(screen.getByTestId('todo-status-todo-1')).toHaveTextContent('todo');
    expect(screen.getByTestId('todo-status-todo-2')).toHaveTextContent('in-progress');
  });

  test('addTodo adds a new todo with correct id and createdAt', () => {
    render(
      <TodoListProvider initialTodos={[]}>
        <TestComponent />
      </TodoListProvider>
    );

    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    fireEvent.click(screen.getByTestId('add-todo-btn'));

    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    const todoItem = screen.getByTestId('todo-item');
    expect(todoItem).toBeInTheDocument();
    expect(screen.getByTestId(/todo-title-todo-/)).toHaveTextContent('Test Todo');
    expect(screen.getByTestId(/todo-status-todo-/)).toHaveTextContent('todo');
    
    // Check that createdAt is set correctly
    const createdAtElement = screen.getByTestId(/todo-created-at-todo-/);
    expect(createdAtElement).toHaveTextContent(new Date('2023-01-03').toISOString());
  });

  test('updateTodo updates an existing todo', () => {
    render(
      <TodoListProvider initialTodos={initialTodos}>
        <TestComponent />
      </TodoListProvider>
    );

    expect(screen.getByTestId('todo-title-todo-1')).toHaveTextContent('Initial Todo 1');
    expect(screen.getByTestId('todo-status-todo-1')).toHaveTextContent('todo');

    fireEvent.click(screen.getByTestId('update-todo-todo-1'));

    expect(screen.getByTestId('todo-title-todo-1')).toHaveTextContent('Updated Todo');
    expect(screen.getByTestId('todo-status-todo-1')).toHaveTextContent('done');
  });

  test('deleteTodo removes a todo', () => {
    render(
      <TodoListProvider initialTodos={initialTodos}>
        <TestComponent />
      </TodoListProvider>
    );

    expect(screen.getByTestId('todo-count')).toHaveTextContent('2');
    expect(screen.getByTestId('todo-title-todo-1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete-todo-todo-1'));

    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    expect(screen.queryByTestId('todo-title-todo-1')).not.toBeInTheDocument();
  });

  test('dialog state management works correctly', () => {
    render(
      <TodoListProvider initialTodos={initialTodos}>
        <TestComponent />
      </TodoListProvider>
    );

    // Check initial dialog states
    expect(screen.queryByTestId('add-dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('current-todo')).not.toBeInTheDocument();

    // Open add dialog
    fireEvent.click(screen.getByTestId('open-add-dialog'));
    expect(screen.getByTestId('add-dialog')).toBeInTheDocument();

    // Open edit dialog
    fireEvent.click(screen.getByTestId('open-edit-dialog'));
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('current-todo')).toHaveTextContent('Initial Todo 1');
  });

  test('useTodoList throws error when used outside TodoListProvider', () => {
    const TestComponentWithoutProvider: React.FC = () => {
      useTodoList();
      return null;
    };

    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      'useTodoList must be used within a TodoListProvider'
    );
  });

  test('setTodos updates the entire todo list', () => {
    const Wrapper: React.FC = () => {
      const { todos, setTodos } = useTodoList();
      return (
        <div>
          <div data-testid="todo-count">{todos.length}</div>
          <button 
            data-testid="set-todos-btn"
            onClick={() => setTodos([
              { id: 'new-todo', title: 'New Todo', description: '', status: 'todo', createdAt: new Date() }
            ])}
          >
            Set Todos
          </button>
        </div>
      );
    };

    render(
      <TodoListProvider initialTodos={initialTodos}>
        <Wrapper />
      </TodoListProvider>
    );

    expect(screen.getByTestId('todo-count')).toHaveTextContent('2');
    fireEvent.click(screen.getByTestId('set-todos-btn'));
    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
  });

  test('setCurrentTodo updates the current todo', () => {
    const Wrapper: React.FC = () => {
      const { currentTodo, setCurrentTodo } = useTodoList();
      return (
        <div>
          <div data-testid="current-todo-title">{currentTodo?.title || 'No current todo'}</div>
          <button 
            data-testid="set-current-todo-btn"
            onClick={() => setCurrentTodo({
              id: 'test-todo',
              title: 'Test Current Todo',
              description: '',
              status: 'todo',
              createdAt: new Date()
            })}
          >
            Set Current Todo
          </button>
        </div>
      );
    };

    render(
      <TodoListProvider initialTodos={[]}>
        <Wrapper />
      </TodoListProvider>
    );

    expect(screen.getByTestId('current-todo-title')).toHaveTextContent('No current todo');
    fireEvent.click(screen.getByTestId('set-current-todo-btn'));
    expect(screen.getByTestId('current-todo-title')).toHaveTextContent('Test Current Todo');
  });
});
