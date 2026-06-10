import type { Toast } from "@nuxt/ui/composables"

export default function (e: unknown) {
   const appStore = useAppStore()
   const toast = resolveErrorToast(e)
   appStore.notify(toast)
}

/** @internal */
function resolveErrorToast(e: unknown): Partial<Toast> {
   const title = isNuxtError(e)
      ? e.statusText
      : isGeneralError(e)
        ? e.name
        : "Error"
   const description =
      isNuxtError(e) || isGeneralError(e)
         ? e.message
         : "An unexpected error occurred"

   return {
      title,
      description,
      color: "error",
   }
}

/** @internal */
function isGeneralError(e: unknown): e is Error {
   return e instanceof Error
}
