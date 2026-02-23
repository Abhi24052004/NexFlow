import {requireAuth} from '@/lib/auth-utils';
import { LogoutButton } from '@/logout';
import { caller } from '@/trpc/server';
const Page=async()=> {
  await requireAuth();
 const data=await caller.getUsers();
  return( 
    <div className='text-red-500 text-center mt-50' >
      protected server component
      {JSON.stringify(data)}
      <div>
        <LogoutButton/>
      </div>
    </div>
  )
}

export default Page;