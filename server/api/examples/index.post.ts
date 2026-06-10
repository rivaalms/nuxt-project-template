export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   const response = await $api<ApiResponse<boolean>>(`/example-post`, {
      method: "post",
      body,
   })

   return {
      ...response,
      toJSON() {
         return this as ApiResponse<boolean>
      },
   }
})
