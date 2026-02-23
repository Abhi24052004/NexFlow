import {LoginForm} from '@/features/auth/components/login-from';
import { requireUnauth } from '@/lib/auth-utils';
const Page=async()=>{
    await requireUnauth();
    return(
        <div  >
            <LoginForm />
        </div>
    )
}

export default Page;