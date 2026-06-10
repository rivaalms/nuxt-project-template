<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const props = withDefaults(
   defineProps<{
      data?: AuthDTO
      /**
       * Loading prop accepts both primitive `boolean` and `ref()`
       * since this component can be rendered on template or using render function.
       * We provide `ref()` value to maintain reactivity when user is rendering
       * this component using render function
       */
      loading?: Ref<boolean> | boolean
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof schema>]
}>()

const schema = $authSchema().login

const state = reactive<InferSchema<typeof schema>>({
   email: "",
   password: "",
})

/**
 * This will handle both primitive `boolean` and `ref()` type
 * when `props.loading` type is `Ref<boolean>` this will return `ref().value`
 * but if `props.loading` type is `boolean` this will return `boolean`
 */
const loading = computed(() => unref(props.loading))

/**
 * Emit `submit` event with `InferSchema<typeof schema>` data
 */
function onSubmit(e: FormSubmitEvent<InferSchema<typeof schema>>) {
   emit("submit", e.data)
}
</script>

<template>
   <!-- Example of form implementation -->
   <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="flex flex-col gap-4"
   >
      <UFormField
         name="email"
         label="Email"
         required
      >
         <UInput
            v-model="state.email"
            type="email"
            :disabled="loading"
            placeholder="Email address"
            class="w-full"
         />
      </UFormField>
      <UFormField
         name="password"
         label="Password"
         required
      >
         <UInput
            v-model="state.password"
            type="password"
            :disabled="loading"
            placeholder="Password"
            class="w-full"
         />
      </UFormField>
      <div class="flex items-center justify-end">
         <UButton
            type="submit"
            label="Submit"
            :loading="loading"
         />
      </div>
   </UForm>
</template>
