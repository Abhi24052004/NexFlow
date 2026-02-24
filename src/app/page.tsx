"use client"
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth-utils';
import { LogoutButton } from '@/logout';
import { useTRPC } from '@/trpc/client';
import { caller } from '@/trpc/server';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
const Page = () => {
  // await requireAuth();
  // const data = await caller.getUsers();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess() {
      toast.success("AI Job Queued");
    }
  }))
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess() {
      toast.success("Workflow Queued");
    }
  }));
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-red-500 text-center p-8 m-8 border rounded-lg'>
        protected server component
        <div>{JSON.stringify(data)}</div>
        <div className='mt-4'>
          <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
            Test AI
          </Button>
        </div>
        <div className='mt-4'>
          <Button disabled={create.isPending} onClick={() => create.mutate()}>
            Create Workflow
          </Button>
        </div>
        <div className='mt-4'>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default Page;