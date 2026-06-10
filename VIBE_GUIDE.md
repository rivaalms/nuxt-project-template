# Panduan Arsitektur & Vibe-Coding Template Nuxt

Dokumen ini berisi analisis mendalam tentang struktur, stack, pattern, dan konvensi yang digunakan dalam template proyek ini, serta panduan khusus bagi **vibe-coder** (pengembang yang bekerja dengan AI coding agent) agar AI agent dapat bekerja seefektif mungkin tanpa tersesat.

---

## 🛠️ Stack Teknologi

Proyek ini dibangun menggunakan modern JavaScript/TypeScript stack:

- **Core**: [Nuxt v4](https://nuxt.com/docs/getting-started/introduction) (SPA Mode, `ssr: false`, `compatibilityDate: "2025-07-15"`)
- **UI Framework**: [Nuxt UI v4](https://ui.nuxt.com) (berbasis [Tailwind CSS v4](https://tailwindcss.com))
- **State Management**: [Pinia](https://pinia.vuejs.org) dengan [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) (diset untuk menggunakan `localStorage`)
- **Date Utility**: [Day.js](https://day.js.org) (dengan locale default `id`, timezone `Asia/Jakarta`, serta plugin `timezone`, `relativeTime`, dan `utc`)
- **Validation**: [Zod](https://zod.dev)
- **Composables**: [VueUse](https://vueuse.org) (`@vueuse/core` dan `@vueuse/nuxt`)
- **Linting & Formatting**: [ESLint](https://eslint.org) Flat Config (v9+) terintegrasi dengan `@nuxt/eslint` dan `eslint-plugin-prettier`
- **Formatting**: [Prettier](https://prettier.io) (konfigurasi khusus: `tabWidth: 3`, tanpa semicolon, double quotes, serta attribute satu baris per line untuk HTML/Vue)

---

## 📂 Struktur Proyek

Template ini menerapkan arsitektur modular yang membagi kode client, server, dan logic bersama (_shared_):

```
├── app/                      # Source code aplikasi client (frontend)
│   ├── assets/               # Asset statis, termasuk global CSS
│   ├── components/           # Vue components (auto-imported)
│   ├── composables/          # Vue composables
│   ├── layouts/              # Nuxt layouts
│   ├── pages/                # Nuxt routing pages
│   ├── plugins/              # Client-side Nuxt plugins
│   ├── stores/               # Pinia stores
│   └── utils/                # Client-side utility functions
│
├── server/                   # Nitro Server (Backend-For-Frontend / BFF layer)
│   ├── api/                  # API endpoints server (BFF proxy)
│   └── utils/                # Server-side utilities
│
├── shared/                   # Kode yang dishare antara client & server
│   ├── types/                # Global TypeScript definitions & DTOs
│   └── utils/                # Shared utilities
│   │   └── validations/      # Zod schemas
│
├── nuxt.config.ts            # Nuxt Configurations
├── package.json              # Dependencies & scripts
└── tsconfig.json             # TypeScript Compiler Configurations
```

### Konvensi Direktori `shared/`

Berdasarkan dokumentasi Nuxt 4, hanya file langsung di dalam `shared/utils/` yang akan di-scan untuk auto-import. File di dalam subdirektori (seperti `shared/utils/validations/auth.ts`) **tidak** akan di-scan secara otomatis.

- **Konvensi**: Semua schema atau helper di subdirektori harus di-reexport via [shared/utils/index.ts](/shared/utils/index.ts) agar auto-import bekerja di client maupun server.

---

## 🎨 Coding Patterns & Konvensi Penting

### 1. BFF (Backend-For-Frontend) Proxying

Aplikasi client tidak menembak API eksternal secara langsung. Client selalu memanggil endpoint server Nitro lokal (`/api/...`), yang kemudian melakukan proxy ke API eksternal menggunakan helper [$serverApi](/server/utils/$serverApi.ts).

- **Pengambilan Token Otomatis**: `$serverApi` otomatis mengambil cookie `auth-token` dari request client dan menyuntikkannya sebagai `Authorization: Bearer <token>` ke API eksternal.
- **Auto-Cleanup 401**: Jika API eksternal mengembalikan status `401 Unauthorized`, `$serverApi` otomatis menghapus cookie `auth-token` dari browser client.
- **Type Inference via `toJSON()`**: Agar Nuxt client dapat mendeteksi return type dari server API secara akurat, server endpoint wajib menyertakan method `toJSON()` yang meng-cast output ke `ApiResponse<T>`. Contoh:
   ```typescript
   export default defineEventHandler(async (event) => {
      const data = { foo: "bar" }
      return {
         success: true,
         data,
         error: "",
         message: "Request success",
         toJSON() {
            return this as ApiResponse<typeof data>
         },
      }
   })
   ```

### 2. Wrapper Custom `useApi`

Template ini menyediakan composable [useApi](/app/composables/useApi.ts) yang merupakan wrapper dari `useFetch` Nuxt.

- **Non-reactive default**: Secara default, `watch` diset ke `false` (`watch: opts.watch ?? false`). Ini mencegah `useApi` memicu request berulang kali secara tidak sengaja ketika parameter reaktif berubah (masalah umum di Nuxt). Jika Anda ingin parameter reaktif di-watch secara otomatis, kirim opsi `{ watch: [reactiveParam] }` secara eksplisit, atau buat watcher untuk parameter yang ingin di-watch secara manual. Contoh:

   ```typescript
   const query = reactive({ page: 1, per_page: 10 })
   const { data, refresh } = useApi(`/api/users`, { query })

   watch(
      () => query.page,
      () => {
         refresh()
      }
   )
   ```

- **Auto-Error Notification**: Jika request gagal, `useApi` otomatis memanggil `$notifyError` untuk menampilkan pesan kesalahan menggunakan sistem toast global.

### 3. Global Modal System & Reactive Render Function

Template ini mendefinisikan sistem modal terpusat menggunakan Pinia store ([appStore](/app/stores/app.ts)) dan sebuah komponen `<UModal>` global di [app.vue](/app/app.vue).

- **Pola Penggunaan**: Modal dibuka secara programatis dengan mempassing VNode menggunakan fungsi `h()` dari Vue.
- **Mengalirkan Reactivity**: Agar state loading di dalam modal tetap reaktif, ref reaktif (`shallowRef` atau `ref`) dikirim langsung sebagai prop ke VNode. Di dalam komponen, gunakan `unref` untuk mengakses nilainya.

   ```typescript
   // Di Halaman Utama (Parent)
   const loading = shallowRef(false)
   function openForm() {
      appStore.openModal(
         "Form Title",
         h(FormAuth, {
            loading: loading, // Kirim Ref reaktif
            onSubmit: onSubmit,
         })
      )
   }

   // Di Komponen (FormAuth.vue)
   const props = defineProps<{ loading?: Ref<boolean> | boolean }>()
   const loading = computed(() => unref(props.loading))
   ```

### 4. Tailwind CSS v4 Dynamic Classes

Karena dynamic classes seperti `max-w-${width}` tidak dapat dianalisa secara statis oleh Tailwind, kita menggunakan fitur `@source` di Tailwind v4.

- **Solusi**: Dynamic widths dideklarasikan di dalam [app/assets/css/main.css](/app/assets/css/main.css) menggunakan `@source`:
   ```css
   @source inline("max-w-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl,8xl}");
   ```
   Hal ini memaksa Tailwind v4 untuk mengompilasi utility class tersebut agar siap digunakan saat runtime.

### 5. ESLint & Strict Import Checking (Flat Config)

ESLint di proyek ini dikonfigurasi menggunakan berkas [eslint.config.mjs](/eslint.config.mjs) (Flat Config).

- **Integrasi Prettier**: Semua pemformatan gaya ditangani secara terpusat oleh Prettier, dan akan dideteksi oleh ESLint sebagai error via `eslint-plugin-prettier`.
- **Mencegah Manual Import**: ESLint diatur secara ketat dengan aturan `no-restricted-imports`. Upaya mengimpor secara manual modul-modul berikut akan dideteksi sebagai error:
   - Vue core APIs (`ref`, `reactive`, `computed`, `watch`, dll.) dari package `"vue"`.
   - Nuxt core APIs (`useNuxtApp`, `useToast`, `defineEventHandler`, dll.) dari package `"#imports"`.
   - Komponen lokal langsung dari berkas pathnya (seperti `~/components/form/FormAuth.vue` -- gunakan auto-import di template atau virtual `"#components"` jika menggunakan render function `h()`).
   - Composables, stores, dan utils lokal.

---

## 🤖 Panduan Vibe-Coding (AI Agent Guidelines)

Bagi pengembang yang menggunakan AI Coding Agent (seperti Claude, Cursor, Gemini, Copilot), berikan instruksi berikut kepada AI Agent Anda untuk memastikan kode yang dihasilkan sesuai standar proyek dan tidak membuang resource token/proses.

### 🚨 Aturan Utama untuk AI Agent (System Instructions)

1. **Gunakan Prettier dengan Tab 3**: Proyek ini menggunakan `tabWidth: 3` dengan indentasi spasi, double-quotes (`"`), dan tanpa titik koma (no-semicolon). Format file Anda dengan standard ini.
2. **Manfaatkan Auto-Imports secara Maksimal**: Jangan pernah menulis import manual untuk modul bawaan Vue/Nuxt seperti `ref`, `computed`, `reactive`, `h`, `unref`, `$fetch`, `useNuxtApp`, `useToast`, serta utility custom proyek seperti `$api`, `$formatDate`, `$formatNumber`, `$notifyError`, `useAppStore`, dan `$authSchema`. Semua ini di-import secara otomatis oleh Nuxt.
3. **Import Komponen untuk Render Function `h()`**: Jika merender komponen menggunakan Vue render function `h()`, komponen tersebut harus di-import dari virtual package `#components`.
   - _Contoh_: `import { FormAuth } from "#components"`
4. **Terapkan Pola BFF & `toJSON()`**: Setiap kali membuat API endpoint baru di direktori `server/api/`, pastikan untuk menggunakan `$serverApi(event)` jika membutuhkan API eksternal, dan selalu sertakan method `toJSON()` pada response objek agar inferensi tipe TS di client bekerja dengan sempurna.
5. **Re-export Shared Utils**: Jika Anda menambahkan file baru di dalam subdirektori `shared/utils/...`, pastikan untuk me-reexport fungsi tersebut di [shared/utils/index.ts](/shared/utils/index.ts).
6. **Gunakan Global Types**: Semua interface data transfer object (DTO) diletakkan di `shared/types/dto/` dan dideklarasikan secara global (`interface DTOName`) tanpa keyword `export`, agar otomatis tersedia di semua file TypeScript proyek tanpa perlu import.
7. **Konfigurasi Tailwind CSS di VSCode**: Jika menggunakan Nuxt UI v4, pastikan VSCode diset untuk melakukan autocomplete Tailwind CSS pada atribut `ui` dengan menambahkan `"tailwindCSS.classAttributes": ["class", "ui"]` pada settings workspace.
8. **Patuhi Aturan ESLint**: Selalu validasi kode menggunakan perintah `pnpm lint`. Jangan menulis import manual untuk API/utilitas yang di-autoimport, karena ESLint secara ketat akan melempar error `no-restricted-imports` dan membatalkan proses build.
