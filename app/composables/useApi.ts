export default createUseFetch((opts) => {
   return {
      ...opts,
      watch: opts.watch ?? false,
      $fetch: $api,
      onResponseError({ response }) {
         $notifyError(response._data)
      },
   }
})
