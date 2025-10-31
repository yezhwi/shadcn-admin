import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import { statusOptions } from '../data/data';
import { type Todo } from '../data/schema';
import { TodoListRowActions } from './todo-list-row-actions';

export const todoListColumns: ColumnDef<Todo>[] = [
  { id: 'select', header: ({ table }) => (
      <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' className='translate-y-[2px]' />
    ), cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' className='translate-y-[2px]' />
    ), enableSorting: false, enableHiding: false },
  { accessorKey: 'id', header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ), cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>, enableSorting: false, enableHiding: false },
  { accessorKey: 'title', header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ), cell: ({ row }) => (
      <div className='flex items-center space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>{row.getValue('title')}</span>
      </div>
    ) },
  { accessorKey: 'status', header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ), cell: ({ row }) => {
      const status = statusOptions.find((s) => s.value === row.getValue('status'));
      return status ? (
        <div className='flex items-center gap-2'>
          {status.icon && <status.icon className='text-muted-foreground size-4' />}
          <Badge variant={status.value === 'done' ? 'default' : 'secondary'}>{status.label}</Badge>
        </div>
      ) : null;
    }, filterFn: (row, id, value) => value.includes(row.getValue(id)) },
  { accessorKey: 'createdAt', header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ), cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } },
  { id: 'actions', cell: ({ row }) => <TodoListRowActions row={row} /> },
];