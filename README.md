# Nuxt Project Template 🚀

Selamat datang di template proyek Nuxt! Repository ini adalah boilerplate terstruktur yang dirancang untuk mempercepat pengembangan aplikasi frontend modern dengan integrasi server BFF (Backend-for-Frontend) yang kuat, aman, dan ramah terhadap AI Coding Agents (_vibe-coding_).

---

## 🛠️ Stack Teknologi

Template ini menggunakan kombinasi teknologi modern berikut:

- **Framework**: [Nuxt v4](https://nuxt.com/) (Single Page Application, `ssr: false`)
- **UI & Styling**: [Nuxt UI v4](https://ui.nuxt.com) & [Tailwind CSS v4](https://tailwindcss.com)
- **State Management**: [Pinia](https://pinia.vuejs.org) + [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) (`localStorage`)
- **Validasi**: [Zod](https://zod.dev)
- **Date Utility**: [Day.js](https://day.js.org) (default timezone `Asia/Jakarta`, locale `id`)
- **Composables**: [VueUse](https://vueuse.org)
- **Linting & Formatting**: [ESLint](https://eslint.org) Flat Config (v9+) terintegrasi dengan `@nuxt/eslint` dan `eslint-plugin-prettier`
- **Peralatan**: [Prettier](https://prettier.io) (konfigurasi: `tabWidth: 3`, double-quotes, no-semicolon)

---

## 🚀 Memulai (Setup Cepat)

Pastikan Anda menggunakan Node.js versi terbaru (LTS direkomendasikan) dan `pnpm` sebagai package manager.

### 1. Instalasi Dependencies

```bash
pnpm install
```

### 2. Jalankan Development Server

Memulai server lokal pada port `http://localhost:3000`:

```bash
pnpm dev
```

### 3. Build untuk Produksi

```bash
# Build aplikasi
pnpm build

# Preview hasil build lokal
pnpm preview
```

### 4. Format & Lint Kode

Proyek ini menegakkan aturan pemformatan dan linter yang ketat. Selalu jalankan format dan pengecekan kode sebelum membuat commit:

```bash
# Memformat kode menggunakan Prettier
pnpm format

# Menjalankan ESLint (dengan integrasi Prettier)
pnpm lint

# Menjalankan ESLint auto-fix
pnpm exec eslint . --fix
```

---

## 📂 Struktur Direktori Utama

Kami membagi kode ke dalam tiga bagian utama (sesuai konvensi Nuxt 4):

- [app/](/app): Area pengembangan frontend utama (pages, components, layouts, stores, utils).
- [server/](/server): Nitro Server yang berfungsi sebagai Backend-For-Frontend (BFF).
- [shared/](/shared): Berisi tipe data TypeScript global ([shared/types/](/shared/types)) dan utilitas/skema validasi Zod ([shared/utils/](/shared/utils)) yang digunakan bersama oleh `app/` dan `server/`.

> [!IMPORTANT]
> **Aturan Auto-Import Nuxt 4 di Direktori `shared/`**:
> Hanya berkas di level teratas `shared/utils/` yang di-scan secara otomatis. Untuk modul dalam subdirektori (misal `shared/utils/validations/auth.ts`), Anda **wajib** mengekspornya kembali (_re-export_) di [shared/utils/index.ts](/shared/utils/index.ts) agar auto-import bekerja dengan baik.

---

## 🎨 Pola Pengembangan & Konvensi Koding

Sebelum Anda mulai menulis kode, harap pahami arsitektur template ini yang terperinci di dalam berkas panduan utama:

👉 **[PANDUAN LENGKAP ARSITEKTUR & VIBE-CODING (VIBE_GUIDE.md)](/VIBE_GUIDE.md)**

Berikut adalah rangkuman singkat pola penting yang digunakan:

### 1. BFF (Backend-For-Frontend) Proxy

Client tidak memanggil API pihak ketiga secara langsung. Client mengirim request ke endpoint di `server/api/` yang kemudian diteruskan menggunakan [$serverApi](/server/utils/$serverApi.ts). Helper ini otomatis:

- Membaca dan menyuntikkan token otentikasi dari cookie `auth-token`.
- Menghapus cookie otentikasi jika mendapat respons `401 Unauthorized` dari API pihak ketiga.
- _Type Safety_: Endpoint server wajib menyertakan method `toJSON()` agar TypeScript client dapat membaca tipe data respons secara otomatis.

### 2. Request API di Client (`useApi` & `$api`)

- **`useApi`**: Gunakan custom composable [useApi](/app/composables/useApi.ts) untuk memanggil API lokal secara reaktif. Secara default, `watch: false` untuk mencegah request duplikat saat parameter reaktif berubah. Jika terjadi error, toast notifikasi kesalahan akan otomatis muncul secara global.
- **`$api`**: Untuk request imperatif sekali jalan tanpa reactivity (seperti submit form), gunakan langsung [$api](/app/utils/$api.ts). `$api` adalah instance `$fetch` kustom yang dikonfigurasi di [app/utils/$api.ts](/app/utils/$api.ts). Ini di-auto-import secara otomatis oleh Nuxt.

### 3. Sistem Modal Global

Membuka modal kini dapat dilakukan secara programatis di mana saja menggunakan Pinia store [appStore](/app/stores/app.ts) dan fungsi render `h()` dari Vue. Baca selengkapnya di [modal-form.vue](/app/pages/modal-form.vue) sebagai contoh implementasi.

---

## 🤖 Menulis Kode dengan AI Agent (Vibe-Coding)

Jika Anda menggunakan AI coding assistant (seperti Cursor, Claude, Gemini, dll.) untuk menulis kode di proyek ini, terdapat [AGENTS.md](/AGENTS.md) berisi rules yang **wajib** dipatuhi oleh AI agent. Jika diperlukan, **berikan berkas [VIBE_GUIDE.md](/VIBE_GUIDE.md) kepada AI Anda** sebagai konteks lebih lengkap sebelum meminta bantuan. Berkas-berkas tersebut berisi instruksi terperinci untuk AI agar:

1. Mengikuti format Prettier (tabWidth: 3, double quotes, no-semicolon).
2. Menghindari penulisan `import` manual yang redundan karena auto-import Nuxt.
3. Memasukkan komponen ke dalam virtual package `#components` jika memanggil modal via render function `h()`.
4. Menambahkan dynamic class ke konfigurasi `@source` di [main.css](/app/assets/css/main.css) agar Tailwind v4 mengompilasi utility classes dengan benar saat runtime.
5. Memastikan semua kode lolos uji linter dengan menjalankan `pnpm lint` dan mematuhi aturan import yang ketat (`no-restricted-imports`).
