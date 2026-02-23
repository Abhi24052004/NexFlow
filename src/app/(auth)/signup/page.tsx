import {RegisterForm} from '@/features/auth/components/Register-form';
import { requireUnauth } from '@/lib/auth-utils';
const Page=async()=>{
    await requireUnauth();
    return(
        <RegisterForm />
    )
}
export default Page;