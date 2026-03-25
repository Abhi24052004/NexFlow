import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth" // Import the Polar plugin for the client

const baseURL =
    typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL ||
          process.env.BETTER_AUTH_URL ||
          "http://localhost:3000"

export const authClient = createAuthClient({
    baseURL,
    basePath: "/api/auth",
    plugins:[polarClient()]
})