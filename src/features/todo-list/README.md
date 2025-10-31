# Todo List Feature

A comprehensive todo list management system built with React, TypeScript, and ShadCN UI.

## Overview

The Todo List feature provides users with a powerful interface to manage their tasks efficiently. It includes capabilities to create, read, update, and delete todo items, as well as filter and sort them based on various criteria.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **ShadCN UI** - Component library
- **TanStack React Table** - Data table management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Context API** - State management

## Project Structure

```
src/features/todo-list/
├── components/
│   ├── todo-list-columns.tsx    # Table column definitions
│   ├── todo-list-dialogs.tsx    # Dialog management
│   ├── todo-list-mutate-drawer.tsx  # Add/edit todo drawer
│   ├── todo-list-primary-buttons.tsx # Primary action buttons
│   ├── todo-list-provider.tsx   # Context provider
│   ├── todo-list-row-actions.tsx # Row-level actions
│   └── todo-list-table.tsx      # Data table component
├── data/
│   ├── data.tsx                 # Sample data and constants
│   └── schema.ts                # Zod schemas
├── index.tsx                    # Main feature component
└── README.md                    # This file
```

## Key Components

### TodoListProvider
Manages the state of the todo list using React Context. Provides functions to add, update, and delete todo items.

### TodoListTable
Displays the todo items in a responsive data table with sorting, filtering, and pagination capabilities.

### TodoListMutateDrawer
A drawer interface for adding new todo items or editing existing ones, with form validation using React Hook Form and Zod.

### TodoListRowActions
Provides row-level actions (edit, delete, status change) for each todo item using a dropdown menu.

## API Endpoints

Currently, the todo list uses in-memory storage. Future versions will integrate with a backend API.

### Mock Endpoints

- `GET /api/todos` - Retrieve all todo items
- `POST /api/todos` - Create a new todo item
- `PUT /api/todos/:id` - Update an existing todo item
- `DELETE /api/todos/:id` - Delete a todo item

## Usage

1. **Adding a Todo**: Click the "Add Todo" button to open the drawer, fill in the details, and click "Save".
2. **Editing a Todo**: Click the three-dot menu on a todo item and select "Edit" to modify its details.
3. **Deleting a Todo**: Click the three-dot menu on a todo item and select "Delete".
4. **Changing Status**: Click the three-dot menu on a todo item, hover over "Status", and select the desired status.
5. **Filtering**: Use the filter dropdowns to filter todo items by status.
6. **Sorting**: Click on column headers to sort the todo items.
7. **Pagination**: Use the pagination controls to navigate between pages.

## Future Enhancements

- Backend integration with REST API
- User authentication and authorization
- Due dates and reminders
- Task prioritization
- Subtasks support
- Search functionality
- Dark mode support
- Mobile optimization
- Export/import todos
- Analytics and insights