import {headers} from 'next/headers'
import {redirect} from 'next/navigation'
import {auth} from './auth'
import { cache } from 'react'

export const requireAuth=cache(async()=>{
    const session=await auth.api.getSession(
        {
            headers:await headers(),
        }
    );
    if(!session){
        redirect("/login");
    }
    return session;
})

export const requireUnauth=async()=>{
    const session=await auth.api.getSession(
        {
            headers:await headers(),
        }
    );
    if(session){
        redirect("/");
    }
    
}