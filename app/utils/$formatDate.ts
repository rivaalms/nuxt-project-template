import type { Dayjs } from "dayjs"

/**
 * Helper function for formatting dates
 * @param date Date to format
 * @param format Format string
 * @returns Formatted date
 * @example
 * ```js
 * const formattedDate = $formatDate(new Date())
 * const formattedDate2 = $formatDate("2022-01-01")
 * const formattedDate3 = $formatDate(dayjs("2022-01-01"))
 * ```
 */
export default function (
   date: string | Date | Dayjs,
   format: string = "DD MMM YYYY"
) {
   const dayjs = useDayjs()
   return dayjs.isDayjs(date) ? date.format(format) : dayjs(date).format(format)
}
