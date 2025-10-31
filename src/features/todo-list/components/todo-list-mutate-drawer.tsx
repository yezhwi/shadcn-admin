import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { type Todo } from '../data/schema';
import { useTodoList } from './todo-list-provider';

type TodoListMutateDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTodo?: Todo;
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
});

type TodoForm = z.infer<typeof formSchema>;

export function TodoListMutateDrawer({ open, onOpenChange, currentTodo }: TodoListMutateDrawerProps) {
  const isEdit = !!currentTodo;
  const { addTodo, updateTodo } = useTodoList();

  const form = useForm<TodoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentTodo ?? {
      title: '',
      description: '',
      status: 'todo',
    },
  });

  const onSubmit = (data: TodoForm) => {
    if (isEdit && currentTodo) {
      updateTodo(currentTodo.id, data);
    } else {
      addTodo(data);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v) form.reset();
    }}>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isEdit ? 'Edit' : 'Add'} Todo</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update the todo item by providing necessary info.'
              : 'Add a new todo item by providing necessary info.'}
            Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form id='todo-form' onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6 overflow-y-auto px-4'>
            <FormField control={form.control} name='title' render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name='description' render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='Enter a description' rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name='status' render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='todo' />
                        </FormControl>
                        <FormLabel className='font-normal'>Todo</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='in-progress' />
                        </FormControl>
                        <FormLabel className='font-normal'>In Progress</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='done' />
                        </FormControl>
                        <FormLabel className='font-normal'>Done</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          </form>
        </Form>
        <SheetFooter className='mt-6 flex justify-between px-4'>
          <SheetClose asChild>
            <Button variant='outline'>Cancel</Button>
          </SheetClose>
          <Button type='submit' form='todo-form'>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}