import { H3Event } from "h3"

export default function (event: H3Event) {
   const config = useRuntimeConfig(event)
   const token = getCookie(event, "auth-token")

   return $fetch.create({
      baseURL: config.apiUrl,
      headers: {
         /**
          * Default Accept header
          * Overrided when accept type is provided in implementation options
          */
         Accept: "application/json",
      },
      onRequest({ options }) {
         if (token) {
            /**
             * Inject Bearer token for authentication if available
             */
            options.headers.set("Authorization", `Bearer ${token}`)
         }
      },
      onRequestError({ error }) {
         /**
          * Throw as H3 error for consistency
          */
         throw createError({
            statusCode: 500,
            statusText: error.name,
            message: error.message,
            name: error.name,
         })
      },
      onResponseError({ error, response }) {
         /**
          * Default 401 handler
          * Automatically delete [auth-token] cookie
          */
         if (response.status == 401) {
            deleteCookie(event, "auth-token", {
               path: "/",
            })
         }

         const data: ApiResponse<unknown> | Record<"name" | "message", string> =
            response._data

         throw createError({
            status: response.status,
            statusText: response.statusText,
            message: isApiResponse(data) ? data.error : data.message,
            data: data,
         })
      },
   })
}

/**
 * @internal
 *
 * Alter this when ApiResponse interface changed
 *
 * @reference ~~/shared/types/api.d.ts
 */
function isApiResponse(input: unknown): input is ApiResponse<any> {
   return typeof input === "object" && input !== null && "success" in input
}
