import { requireAuth } from "@/lib/auth-utils";

const Page=async()=>{
    await requireAuth();
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Workflows</h1>
            <p className="text-muted-foreground">
                Manage your workflows here.
            </p>
        </div>
    )
}
export default Page;