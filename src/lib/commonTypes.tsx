// Error types
export type BackendError =
  { simpleError: string, code: number } |
  { complexError: Record<string, string>, code: number } |
  { unknownError: unknown, code: number }

export type BackendResponse =
  { success: any, code?: number } |
  BackendError