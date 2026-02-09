import {caller} from '@/trpc/server';
import {Client} from './client';
import {getQueryClient,trpc} from '@/trpc/server';
import { HydrationBoundary,dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
const Page=async()=>{
  const queryClient=getQueryClient();
  const user=await caller.getUsers();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return( 
    <div className='text-red-500 text-center mt-50' >
      <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<div>Loading...</div>} >
              <Client />
          </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default Page;