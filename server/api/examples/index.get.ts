/**
 * Example of BFF proxy implementation with internal data return
 */
export default defineEventHandler(async (event) => {
   const data = {
      foo: "bar",
   }

   return {
      success: true,
      data,
      error: "",
      message: "Request success",

      // Overrides Nitro serialization behavior to get correct type inference in Nuxt
      toJSON() {
         return this as ApiResponse<typeof data>
      },
   }
})
