"use client"
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

export const Client=()=>{
    const trpc=useTRPC();
    const {data:users}=useSuspenseQuery(trpc.getUsers.queryOptions());
  return(
    <div className='text-red-500 text-center mt-50' > 
    Client Component : {JSON.stringify(users)}
    </div>
  )
}