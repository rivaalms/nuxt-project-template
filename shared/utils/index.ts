/**
 * According to https://nuxt.com/docs/4.x/directory-structure/shared#how-files-are-scanned
 * Only files in `shared/utils/` directories will be auto-imported.
 * Files nested within subdirectories of this directory will not be auto-imported.
 *
 * Re-export all files from subdirectories to allow auto-importing from them.
 */

export { $authSchema } from "./validations/auth"
