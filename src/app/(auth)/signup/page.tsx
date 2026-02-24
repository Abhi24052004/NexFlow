import {RegisterForm} from '@/features/auth/components/Register-form';
import { requireUnauth } from '@/lib/auth-utils';
import Link from 'next/link';
import Image from 'next/image';
const Page=async()=>{
    await requireUnauth();
    return(
        <RegisterForm />
    )
}
export default Page;