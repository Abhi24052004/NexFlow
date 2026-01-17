import {Button} from '@/components/ui/button';
import {prisma} from '@/lib/db';
const Page=async()=>{
  const user=await prisma.user.findMany();
  return( 
    <div className='text-red-500 text-center mt-50' >
    {JSON.stringify(user)}
    </div>
  )
}

export default Page;