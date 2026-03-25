import { WorkflowsList, WorkflowsContainer } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { requireAuth } from "@/lib/auth-utils";
import { workflowsParams } from "@/features/workflows/params";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

type Props={
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    await requireAuth();
    const params=await workflowsParamsLoader(searchParams);
    prefetchWorkflows(params);
    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    )
}
export default Page;