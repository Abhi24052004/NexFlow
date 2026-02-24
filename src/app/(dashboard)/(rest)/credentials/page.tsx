import { requireAuth } from "@/lib/auth-utils";

const Page=async ()=>{
    await requireAuth();
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Credentials</h1>
            <p className="text-muted-foreground">
                Manage your credentials here.
            </p>
        </div>
    )
}
export default Page;