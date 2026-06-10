<script setup lang="ts">
const appStore = useAppStore()

const loading = shallowRef(false)

async function onSubmit(data: InferFnSchema<typeof $authSchema, "login">) {
   loading.value = true
   try {
      const response = await $api(`/api/examples`, {
         method: "post",
         body: data,
      })

      /**
       * Example of notifying user after successful request
       */
      appStore.notify({
         title: "Success",
         description: response.message,
         color: "success",
      })

      // Do other logic
   } catch (e) {
      /**
       * Example of handling API error.
       * We can send error catched to `$notifyError()` immediately
       * and let it handle by our central notification system.
       */
      $notifyError(e)
   } finally {
      loading.value = false
   }
}
</script>

<template>
   <!-- Example of page with form -->
   <div class="container max-w-lg mx-auto">
      <FormAuth
         :loading="loading"
         @submit="onSubmit"
      />
   </div>
</template>
