/**
 * Utility types for TypeScript.
 */

/**
 * Make an object type optional recursively for nested objects.
 */
declare type DeepPartial<T> = {
   [K in keyof T]?: T[K] extends Record<string, unknown>
      ? DeepPartial<T[K]>
      : T[K] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[K]
}

/**
 * Infer Zod schema type from a function that returns Zod schemas.
 *
 * @example
 *
 * ```ts
 * import { z } from "zod"
 *
 * const authSchema = () => ({
 *    login: z.object({
 *       username: z.string().min(3),
 *       password: z.string().min(6),
 *    }),
 *    register: z.object({
 *       username: z.string().min(3),
 *       password: z.string().min(6),
 *       email: z.string().email(),
 *    }),
 * })
 *
 * // Infer login schema type
 * type LoginSchema = InferFnSchema<typeof authSchema, "login">
 *
 * // ✅ Correct: LoginSchema type is inferred correctly
 * const loginSchema: LoginSchema = {
 *    username: "johndoe",
 *    password: "password123",
 * }
 *
 * // ❌ Type error: Missing field 'password'
 * const invalidLogin: LoginSchema = {
 *    username: "johndoe",
 * }
 * ```
 */
declare type InferFnSchema<
   Fn extends (
      ...args: any[]
   ) => Record<string, import("zod").ZodType | import("zod").ZodLazy>,
   Key extends keyof ReturnType<Fn>,
> = import("zod").infer<ReturnType<Fn>[Key]>

/**
 * Infer Zod schema type from a Zod schema.
 *
 * @example
 *
 * ```ts
 * import { z } from "zod"
 *
 * const userSchema = z.object({
 *    username: z.string().min(3),
 *    password: z.string().min(6),
 * })
 *
 * // Infer user schema type
 * type UserSchema = InferSchema<typeof userSchema>
 *
 * // ✅ Correct: UserSchema type is inferred correctly
 * const userSchema: UserSchema = {
 *    username: "johndoe",
 *    password: "password123",
 * }
 *
 * // ❌ Type error: Missing field 'password'
 * const invalidUser: UserSchema = {
 *    username: "johndoe",
 * }
 * ```
 */
declare type InferSchema<
   S extends import("zod").ZodType | import("zod").ZodLazy,
> = import("zod").infer<S>

declare type HintedString<S extends string> = S | (string & {})
