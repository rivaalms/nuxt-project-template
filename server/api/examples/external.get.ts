/**
 * Example of BFF proxy implementation with external API data return
 */
export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)

   // Get query params from request
   const query = getQuery(event)

   // Proxy request to external API
   const response = await $api<ApiResponse<AuthDTO>>(`/external`, {
      method: "get",
      query,
   })

   // You can transform or do any additional logic here
   doSomething()

   return {
      ...response,

      // Always override toJSON() to ensure correct type inference in Nuxt
      toJSON() {
         return this as ApiResponse<AuthDTO>
      },
   }
})

/**
 * @internal
 * Example purposes
 */
function doSomething() {
   // ... doing something
   return true
}
