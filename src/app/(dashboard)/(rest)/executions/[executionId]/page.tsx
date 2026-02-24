interface PageProps{
    params:Promise<{
        executionId:string
    }>
}
const Page=async({params}:PageProps)=>{
    const {executionId}=await params;
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Execution Details</h1>
            <p className="text-muted-foreground">
                Manage your execution with ID: {executionId}
            </p>
        </div>
    )
}
export default Page;