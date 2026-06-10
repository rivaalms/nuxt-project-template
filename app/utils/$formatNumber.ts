/**
 * Helper function for formatting numbers
 * @param input Number to format
 * @param opts Options for formatting
 * @returns Formatted number
 * @example
 * ```js
 * const formattedNumber = $formatNumber(1000)
 * const formattedNumber2 = $formatNumber(1000, { style: "currency", currency: "IDR" })
 * ```
 */
export default function (
   input: number,
   opts: Intl.NumberFormatOptions & { locale?: Intl.LocalesArgument } = {
      style: "decimal",
      locale: "id-ID",
   }
) {
   return Intl.NumberFormat(opts.locale, {
      ...opts,
   }).format(input)
}
