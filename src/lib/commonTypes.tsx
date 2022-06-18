// Error types
// Backend error types
export type BackendError =
  { simpleError: string, code: number } |
  { complexError: Record<string, string>, code: number } |
  { unknownError: unknown, code: number }

// Frontend error types
// export type FrontendError = { simpleError: Error, code?: number }
export class FrontendError extends Error {
  code?: number
  errObj?: unknown

  constructor(message: string, code?: number, errObj?: unknown) {
    super(message)
    this.code = code
    this.errObj = errObj
  }

  outputErrorToConsole() {
    console.error(this.message)
    if (this.errObj) console.error(this.errObj)
  }

  static backendErrorToFrontendError(err: BackendError) {
    if ("simpleError" in err) return new FrontendError(err.simpleError, err.code)
    else if ("complexError" in err)
      return new FrontendError("Failed to post to callback", err.code, err.complexError)
    else return new FrontendError("Failed to post to callback", err.code, err.unknownError)
  }
}

export type BackendResponse =
  { success: any, code?: number } |
  BackendError