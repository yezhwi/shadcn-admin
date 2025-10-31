import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoListTable } from './todo-list-table';
import { TodoListProvider } from './todo-list-provider';
import { Todo } from '../data/schema';
import { vi } from 'vitest';

// Mock the getRouteApi function from TanStack Router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getRouteApi: () => ({
      useSearch: () => ({}),
      useNavigate: vi.fn(),
    }),
  };
});

// Mock the useTableUrlState hook
vi.mock('@/hooks/use-table-url-state', () => ({
  useTableUrlState: () => ({
    globalFilter: '',
    onGlobalFilterChange: vi.fn(),
    columnFilters: [],
    onColumnFiltersChange: vi.fn(),
    pagination: { pageIndex: 0, pageSize: 10 },
    onPaginationChange: vi.fn(),
    ensurePageInRange: vi.fn(),
  }),
}));

describe('TodoListTable', () => {
  const initialTodos: Todo[] = [
    {
      id: 'todo-1',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      status: 'todo',
      createdAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
      id: 'todo-2',
      title: 'Write report',
      description: 'Quarterly sales report',
      status: 'in-progress',
      createdAt: new Date('2023-01-02T09:00:00Z'),
    },
    {
      id: 'todo-3',
      title: 'Call client',
      description: 'Follow up on project',
      status: 'done',
      createdAt: new Date('2023-01-03T14:00:00Z'),
    },
    {
      id: 'todo-4',
      title: 'Clean house',
      description: 'Vacuum, dust, laundry',
      status: 'todo',
      createdAt: new Date('2023-01-04T08:00:00Z'),
    },
    {
      id: 'todo-5',
      title: 'Exercise',
      description: 'Gym session',
      status: 'done',
      createdAt: new Date('2023-01-05T16:00:00Z'),
    },
  ];

  const renderTable = () => {
    return render(
      <TodoListProvider initialTodos={initialTodos}>
        <TodoListTable />
      </TodoListProvider>
    );
  };

  test('renders the todo list table with all columns and data', () => {
    renderTable();

    // Check table headers
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check table rows
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(initialTodos.length + 1); // +1 for header row

    // Check todo data
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Write report')).toBeInTheDocument();
    expect(screen.getByText('Call client')).toBeInTheDocument();
    expect(screen.getByText('Clean house')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();

    // Check status badges
    expect(screen.getAllByText('Todo').length).toBe(2);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getAllByText('Done').length).toBe(2);
  });

  test('sorts todos by title in ascending and descending order', () => {
    renderTable();

    // Get the title header
    const titleHeader = screen.getByText('Title').closest('th');
    expect(titleHeader).toBeInTheDocument();

    // Click to sort ascending
    fireEvent.click(titleHeader!);

    // Check if todos are sorted by title ascending
    const sortedTitlesAsc = initialTodos
      .map(todo => todo.title)
      .sort()
      .map(title => screen.getByText(title).closest('tr'));

    const rows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(rows).toEqual(sortedTitlesAsc);

    // Click to sort descending
    fireEvent.click(titleHeader!);

    // Check if todos are sorted by title descending
    const sortedTitlesDesc = initialTodos
      .map(todo => todo.title)
      .sort((a, b) => b.localeCompare(a))
      .map(title => screen.getByText(title).closest('tr'));

    expect(screen.getAllByRole('row').slice(1)).toEqual(sortedTitlesDesc);
  });

  test('filters todos by status', async () => {
    renderTable();

    // Check initial todo count
    expect(screen.getAllByRole('row').length).toBe(initialTodos.length + 1);

    // Open status filter dropdown
    const statusFilterButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusFilterButton);

    // Select 'Todo' status
    const todoStatusOption = screen.getByLabelText('Todo');
    fireEvent.click(todoStatusOption);

    // Close the dropdown
    fireEvent.click(statusFilterButton);

    // Check if only todos with 'todo' status are displayed
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(2 + 1); // 2 todos + header
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Clean house')).toBeInTheDocument();
      expect(screen.queryByText('Write report')).not.toBeInTheDocument();
      expect(screen.queryByText('Call client')).not.toBeInTheDocument();
      expect(screen.queryByText('Exercise')).not.toBeInTheDocument();
    });

    // Clear the filter
    fireEvent.click(statusFilterButton);
    fireEvent.click(todoStatusOption); // Uncheck
    fireEvent.click(statusFilterButton);

    // Check if all todos are displayed again
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(initialTodos.length + 1);
    });
  });

  test('handles pagination correctly', async () => {
    // Add more todos to enable pagination
    const manyTodos = [...initialTodos];
    for (let i = 6; i <= 15; i++) {
      manyTodos.push({
        id: `todo-${i}`,
        title: `Todo ${i}`,
        description: `Description ${i}`,
        status: 'todo',
        createdAt: new Date(`2023-01-0${i}`),
      });
    }

    render(
      <TodoListProvider initialTodos={manyTodos}>
        <TodoListTable />
      </TodoListProvider>
    );

    // Check initial page (10 items per page)
    expect(screen.getAllByRole('row').length).toBe(10 + 1); // 10 todos + header

    // Check pagination buttons
    const nextButton = screen.getByRole('button', { name: /next/i });
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(nextButton).toBeEnabled();
    expect(previousButton).toBeDisabled();

    // Go to next page
    fireEvent.click(nextButton);

    // Check second page
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(5 + 1); // 5 todos + header
      expect(screen.getByText('Todo 11')).toBeInTheDocument();
      expect(screen.getByText('Todo 15')).toBeInTheDocument();
      expect(nextButton).toBeDisabled();
      expect(previousButton).toBeEnabled();
    });

    // Go back to previous page
    fireEvent.click(previousButton);

    // Check first page again
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(10 + 1); // 10 todos + header
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Todo 10')).toBeInTheDocument();
      expect(nextButton).toBeEnabled();
      expect(previousButton).toBeDisabled();
    });
  });

  test('selects multiple todos and shows bulk actions', async () => {
    renderTable();

    // Check initial state - bulk actions should be hidden
    expect(screen.queryByText('Bulk Actions')).not.toBeInTheDocument();

    // Select first todo
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip header checkbox
    fireEvent.click(firstCheckbox);

    // Select second todo
    const secondCheckbox = screen.getAllByRole('checkbox')[2];
    fireEvent.click(secondCheckbox);

    // Check if bulk actions are shown
    await waitFor(() => {
      expect(screen.getByText('Bulk Actions')).toBeInTheDocument();
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    // Select all todos
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]; // Header checkbox
    fireEvent.click(selectAllCheckbox);

    // Check if all todos are selected
    await waitFor(() => {
      expect(screen.getByText('5 selected')).toBeInTheDocument();
    });

    // Deselect all todos
    fireEvent.click(selectAllCheckbox);

    // Check if bulk actions are hidden
    await waitFor(() => {
      expect(screen.queryByText('Bulk Actions')).not.toBeInTheDocument();
    });
  });

  test('opens edit dialog when edit button is clicked', () => {
    renderTable();

    // Check initial state - edit dialog should be hidden
    expect(screen.queryByText('Edit Todo')).not.toBeInTheDocument();

    // Click edit button on first todo
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Check if edit dialog is opened
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Buy groceries');
    expect(screen.getByLabelText('Description')).toHaveValue('Milk, eggs, bread');
    expect(screen.getByLabelText('Todo')).toBeChecked();
  });

  test('deletes a todo when delete button is clicked', async () => {
    renderTable();

    // Check initial todo count
    expect(screen.getAllByRole('row').length).toBe(5 + 1);

    // Click delete button on first todo
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Check if todo is deleted
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(4 + 1);
      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    });
  });

  test('updates todo status from row actions', async () => {
    renderTable();

    // Find the first todo's status dropdown
    const statusDropdowns = screen.getAllByRole('button', { name: /todo/i });
    fireEvent.click(statusDropdowns[0]);

    // Select 'In Progress' status
    const inProgressOption = screen.getByLabelText('In Progress');
    fireEvent.click(inProgressOption);

    // Check if status is updated
    await waitFor(() => {
      expect(screen.getAllByText('In Progress').length).toBe(2); // Original + updated
      expect(screen.getByText('Buy groceries').closest('tr')?.querySelector('[data-testid="status-badge"]')).toHaveTextContent('In Progress');
    });
  });
});
