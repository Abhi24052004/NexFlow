import { requireAuth } from "@/lib/auth-utils";

const Page=async ()=>{
    await requireAuth();
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Executions</h1>
            <p className="text-muted-foreground">
                Executions
            </p>
        </div>
    )
}
export default Page;