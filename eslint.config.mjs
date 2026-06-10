// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default withNuxt(eslintPluginPrettierRecommended, {
   rules: {
      // Enforce formatting standards based on .prettierrc (tabWidth: 3, no-semi, double-quotes)
      "prettier/prettier": "error",

      // Restrict manual imports of auto-imported core Vue and Nuxt APIs
      "no-restricted-imports": [
         "error",
         {
            paths: [
               {
                  name: "vue",
                  importNames: [
                     "ref",
                     "reactive",
                     "computed",
                     "watch",
                     "h",
                     "unref",
                     "shallowRef",
                     "toRef",
                     "toRefs",
                     "onMounted",
                     "onUnmounted",
                     "nextTick",
                     "defineComponent",
                     "watchEffect",
                  ],
                  message:
                     "Do not import Vue core APIs manually. Nuxt automatically auto-imports them globally.",
               },
               {
                  name: "#imports",
                  importNames: [
                     "useNuxtApp",
                     "useToast",
                     "defineNuxtPlugin",
                     "defineNuxtConfig",
                     "useRuntimeConfig",
                     "defineEventHandler",
                     "readBody",
                     "getQuery",
                     "createError",
                     "isNuxtError",
                  ],
                  message:
                     "Do not import Nuxt core APIs manually from '#imports'. Nuxt automatically auto-imports them globally.",
               },
            ],
            patterns: [
               {
                  group: [
                     "**/composables/**",
                     "**/stores/**",
                     "**/utils/**",
                     "**/shared/utils/**",
                  ],
                  message:
                     "Do not import composables, stores, or utilities manually. Nuxt automatically auto-imports them globally.",
               },
               {
                  group: ["**/components/**/*.vue"],
                  message:
                     "Do not import Vue components directly from file path. Use auto-imports in templates, or if using Vue render function h(), import from virtual path '#components'.",
               },
            ],
         },
      ],

      // Customize TypeScript & Vue rules for template development
      "@typescript-eslint/no-explicit-any": "off", // Necessary for dynamic type helper generics (e.g. InferFnSchema)
      "@typescript-eslint/no-unused-vars": [
         "warn",
         {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
         },
      ],
      "vue/require-default-prop": "off", // Optional props without defaults are common in Vue 3 + TS setup
      "vue/attributes-order": "warn",

      // General best practices
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
   },
})
