import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";

/**
 * Hook to fetch all executions using suspense
 */
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();
  
  return useSuspenseQuery({
    ...trpc.executions.getMany.queryOptions(params),
    refetchInterval: 2000, // added for autorefresh
  });
};

/**
 * Hook to fetch a single execution using suspense
 */
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery({
    ...trpc.executions.getOne.queryOptions({ id }),
    refetchInterval: 2000, // added for autorefresh
  });
};
