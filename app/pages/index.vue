<script setup lang="ts">
const exampleQuery = reactive({
   page: 1,
   per_page: 10,
})

// Example of using BFF
const { data, status } = useApi(`/api/examples`, {
   method: "get",
   query: exampleQuery,
   transform: (res) => res.data,
   // ... any other useApi options
})
</script>

<template>
   <!-- Page implementation here -->
   <div class="flex flex-col gap-4">
      <div>
         <pre>{{ data }}</pre>
         <p>Status: {{ status }}</p>
      </div>
      <div class="flex items-center gap-4">
         <NuxtLink to="/form-handling"> Form Handling </NuxtLink>
         <NuxtLink to="/modal-form"> Modal Form </NuxtLink>
      </div>
   </div>
</template>
