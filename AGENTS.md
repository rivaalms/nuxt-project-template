# AI Agent Coding Instructions (AGENTS.md)

You are an AI coding assistant working on this **Nuxt v4 / Nuxt UI v4 / Tailwind CSS v4** codebase. To optimize token usage, maintain repository health, and follow project standards, you **must** strictly adhere to the following rules when writing or modifying code.

---

## 🚨 Critical System Rules

### 1. Formatting & Code Style (Prettier Config)

All files must match the project's formatting standard. Do not let your model output standard 2-space or semicolon-heavy code.

- **Indent**: 3 spaces (`tabWidth: 3`). No tabs.
- **Quotes**: Double quotes (`"`) for strings and HTML/Vue attributes.
- **Semicolons**: Disabled (`semi: false`). Never write semicolons.
- **Line Endings**: LF (`endOfLine: "lf"`).
- **Vue/HTML Attributes**: One attribute per line (`singleAttributePerLine: true`).
- **Trailing Commas**: ES5 style.

### 2. Leverage Nuxt Auto-Imports (Do NOT Import Manually)

Nuxt automatically imports core APIs, composables, stores, and custom utilities. Writing manual imports for these will cause ESLint errors (due to strict `no-restricted-imports` rule) and pollute the codebase.

- **Do NOT import** Vue core APIs: `ref`, `reactive`, `computed`, `watch`, `h`, `unref`, `shallowRef`, `computed`, etc.
- **Do NOT import** Nuxt core APIs: `useNuxtApp`, `useToast`, `defineNuxtPlugin`, `defineNuxtConfig`, `useRuntimeConfig`, `defineEventHandler`, `readBody`, `getQuery`, etc.
- **Do NOT import** Project utilities & stores: `$api`, `$formatDate`, `$formatNumber`, `$notifyError`, `useAppStore`, `useApi`, `$authSchema`.

### 3. Rendering Components in Vue `h()`

When using Vue's render function `h()` to pass components dynamically (e.g. to the global modal system):

- **Do** import components from the Nuxt virtual path `#components`.
   - _Correct_: `import { FormAuth } from "#components"`
   - _Incorrect_: `import FormAuth from "@/components/form/FormAuth.vue"`

### 4. ESLint Validations & Formatting Compliance

- **Run Lint Check**: Always validate your code before completing a task by running `pnpm lint`.
- **Follow Auto-Fixes**: Run `pnpm exec eslint . --fix` to resolve standard linting formatting or syntax errors automatically. Do not leave syntax or unused import warnings unattended.

---

## 🎨 Architectural Patterns

### 1. BFF (Backend-For-Frontend) API Requests

- **No Direct External API Calls from Client**: The frontend must only hit Nitro server endpoints (local routes inside `server/api/`).
- **Use `$serverApi` on Server**: Inside server routes, use [$serverApi(event)](/server/utils/$serverApi.ts) to communicate with downstream APIs. It handles token injection and deletes expired credentials on `401`.
- **Inference Typing (`toJSON`)**: Every Nitro endpoint that returns JSON data must override `toJSON()` to maintain type definitions in the client:
   ```typescript
   export default defineEventHandler(async (event) => {
      const data = { message: "Hello" }
      return {
         success: true,
         data,
         error: "",
         message: "Success",
         toJSON() {
            return this as ApiResponse<typeof data>
         },
      }
   })
   ```

### 2. API Fetching on Client (`useApi`)

- Use [useApi](/app/composables/useApi.ts) for fetching.
- **Non-reactive default**: `watch` is disabled by default (`watch: false`). If your fetch depends on reactive parameters (like search terms or pagination), you must explicitly supply the watch array: `useApi(url, { watch: [queryParams] })`.

### 3. Global Modal Reactivity

- When spawning components inside a modal via `appStore.openModal(title, h(Component, { loading }))`:
   - To keep variables (like `loading`) reactive inside the rendered component, pass the reactive `Ref` directly in props.
   - Inside the receiving component, resolve the prop reactivity using `unref`:
      ```typescript
      const props = defineProps<{ loading?: Ref<boolean> | boolean }>()
      const loading = computed(() => unref(props.loading))
      ```

### 4. Shared Utils & Global Types

- **Global Types**: Define DTOs and global interfaces inside [shared/types/dto/](/shared/types/dto) as global namespaces or root interfaces (`interface AuthDTO`) without the `export` keyword. This makes them auto-available without importing.
- **Shared Utils**: If you create a new validation or utility inside a subfolder of `shared/utils/` (like `shared/utils/validations/`), you **must** re-export it in [shared/utils/index.ts](/shared/utils/index.ts) to enable auto-import.

### 5. Dynamic Tailwind CSS v4 Utility Classes

- If you construct classes dynamically (e.g. `max-w-${width}` where `width` is a dynamic prop value), Tailwind's static analyzer will not compile it.
- Instead of safelisting, declare the dynamic classes in the `@source` directive inside [app/assets/css/main.css](/app/assets/css/main.css):
   ```css
   @source inline("max-w-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl,8xl}");
   ```
