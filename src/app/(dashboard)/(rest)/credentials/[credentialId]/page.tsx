interface PageProps{
    params:Promise<{
        credentialId:string
    }>
}
const Page=async({params}:PageProps)=>{
    const {credentialId}=await params;
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Credential Details</h1>
            <p className="text-muted-foreground">
                Manage your credential with ID: {credentialId}
            </p>
        </div>
    )
}
export default Page;