// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   ssr: false,

   css: ["~/assets/css/main.css"],

   modules: [
      "@nuxt/ui",
      "@pinia/nuxt",
      "@vueuse/nuxt",
      "dayjs-nuxt",
      "pinia-plugin-persistedstate/nuxt",
   ],

   components: [
      {
         path: "~/components",
         pathPrefix: false,
      },
   ],

   runtimeConfig: {
      apiUrl: import.meta.env.API_URL,
   },

   dayjs: {
      locales: ["id", "en"],
      defaultLocale: "id",
      defaultTimezone: "Asia/Jakarta",
      plugins: ["timezone", "relativeTime", "utc"],
   },

   piniaPluginPersistedstate: {
      storage: "localStorage",
   },
})
