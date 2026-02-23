"use client"

import {authClient} from "@/lib/auth-client";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";
import { use } from "react";

export const LogoutButton=()=>{
    const router=useRouter();
    const handleLogout=async()=>{
        await authClient.signOut({
            fetchOptions:{
                onSuccess:()=>{
                    router.push("/login")
                }
            }
        });
        
    }
    return(
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
    )
}