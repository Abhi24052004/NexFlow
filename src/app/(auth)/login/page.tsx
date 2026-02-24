import { LoginForm } from '@/features/auth/components/login-from';
import { requireUnauth } from '@/lib/auth-utils';
import Link from "next/link";
import Image from "next/image";
const Page = async () => {
    // await requireUnauth();
    return (
        <LoginForm />
    )
}

export default Page;

