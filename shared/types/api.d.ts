/**
 * Example ApiResponse interface
 * If your API return different response structure,
 * change this interface accordingly
 */
interface ApiResponse<T> {
   success: boolean
   message: string
   error: string
   data: T
}

/**
 * Example Pagination interface
 * If your API return different pagination structure,
 * change this interface accordingly
 */
interface Pagination<T> {
   page: number
   per_page: number
   data: T[]
   from: number
   to: number
   total: number
}
