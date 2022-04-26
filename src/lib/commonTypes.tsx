export interface ErrorResponse {
  error: Record<string, string>
}

export interface SuccessResponse {
  success: Record<string, string>
}

export type ApiResponse = ErrorResponse | SuccessResponse