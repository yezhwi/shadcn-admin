import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { TodoListTable } from './components/todo-list-table';
import { TodoListProvider } from './components/todo-list-provider';
import { TodoListDialogs } from './components/todo-list-dialogs';
import { TodoListPrimaryButtons } from './components/todo-list-primary-buttons';
import { sampleTodos } from './data/data';

export function TodoList() {
  return (
    <TodoListProvider initialTodos={sampleTodos}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Todo List</h2>
            <p className='text-muted-foreground'>
              Manage your daily tasks and stay organized
            </p>
          </div>
          <TodoListPrimaryButtons />
        </div>
        <TodoListTable />
      </Main>

      <TodoListDialogs />
    </TodoListProvider>
  );
}