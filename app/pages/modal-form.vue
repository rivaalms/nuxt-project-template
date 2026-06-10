<script setup lang="ts">
import { FormAuth } from "#components"

const appStore = useAppStore()

const loading = shallowRef(false)

function openForm() {
   appStore.openModal(
      "Form Modal",
      /** Example of rendering form component directly as render function */
      h(FormAuth, {
         /** Send the `ref()` to loading prop so it will reactive */
         loading: loading,
         onSubmit: onSubmit,
      }),
      {
         /** Additional option for modal */
         width: "lg",
      }
   )
}

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
   <div>
      <UButton
         label="Open Form"
         @click="openForm"
      />
   </div>
</template>
