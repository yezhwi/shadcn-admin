import { Circle, CheckCircle, Timer } from 'lucide-react';
import { Todo } from './schema';

export const sampleTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Complete project proposal',
    description: 'Write and submit the project proposal by Friday',
    status: 'todo',
    createdAt: new Date('2023-05-20'),
  },
  {
    id: 'todo-2',
    title: 'Review PR #123',
    description: 'Review the latest pull request from the development team',
    status: 'in-progress',
    createdAt: new Date('2023-05-19'),
  },
  {
    id: 'todo-3',
    title: 'Update documentation',
    description: 'Update the API documentation with new endpoints',
    status: 'todo',
    createdAt: new Date('2023-05-18'),
  },
  {
    id: 'todo-4',
    title: 'Deploy to production',
    description: 'Deploy the latest version to the production server',
    status: 'done',
    createdAt: new Date('2023-05-17'),
  },
  {
    id: 'todo-5',
    title: 'Team meeting',
    description: 'Weekly team sync meeting at 10 AM',
    status: 'todo',
    createdAt: new Date('2023-05-21'),
  },
];

export const statusOptions = [
  { label: 'Todo', value: 'todo', icon: Circle },
  { label: 'In Progress', value: 'in-progress', icon: Timer },
  { label: 'Done', value: 'done', icon: CheckCircle },
];