// Error types
export type BackendError =
  { simple: { code: number, message: string } } |
  { complex: { code: number, object: Record<string, string> } } |
  { unknown: unknown }

// Response types
export type BackendResponse =
  { code?: number, success: any } |
  { simpleError: { message: string } } |
  { complexError: { object: Record<string, string> } } |
  { unknownError: unknown }