import { z } from "zod"

/**
 * Example auth schema
 */
export function $authSchema() {
   const login = z.object({
      email: z.string().email(),
      password: z.string().min(6),
   })

   return { login }
}
