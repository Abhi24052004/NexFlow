import { requireAuth } from "@/lib/auth-utils";

interface PageProps{
    params:Promise<{
        workflowId:string;
    }>
}

const Page=async({params}:PageProps)=>{
    await requireAuth();
    const {workflowId}=await params;
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Workflow Details</h1>
            <p className="text-muted-foreground">
                Manage your workflow with ID: {workflowId}
            </p>
        </div>
    )
}   
export default Page;