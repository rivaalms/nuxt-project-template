import type { H3Error } from "#build/types/nitro-imports"

export default defineNuxtPlugin((nuxtApp) => {
   const handler = $fetch.create({
      // disable auto retry
      retry: false,

      async onResponseError({ response }) {
         const err = response._data as H3Error

         // handle response error here
         // for example, handle auto-redirect and logout if code is 401

         // re-throw error to let nuxt handle it
         throw createError({
            ...err,
            statusText: err.statusMessage,
         })
      },
   })

   return {
      // provide $api to nuxt app via auto-injection
      provide: {
         api: handler,
      },
   }
})
