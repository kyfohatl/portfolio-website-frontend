// Error types
export type BackendError =
  { simple: { code: number, message: string } } |
  { complex: { code: number, object: Record<string, string> } } |
  { unknown: unknown }

// Response types
export type BackendResponse =
  { success: any, code?: number } |
  { simpleError: string } |
  { complexError: Record<string, string> } |
  { unknownError: unknown }