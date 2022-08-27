import { BackendResponse } from "../../../commonTypes"
import { refreshTokens } from "./refreshToken"

// Fetches the given address with the given method and the given request body, either throwing an error if
// unable to authenticate, or returning the data otherwise
export async function fetchWithAuth<T extends BackendResponse>(
  address: string,
  method: string,
  recursionLimit: number,
  body: Record<string, any> = {}
): Promise<T> {
  // Prevent infinite recursion
  if (recursionLimit <= 0) throw new Error("Error: fetchWithAuth recursion limit reached")

  try {
    const response = await fetch(address, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // To allow cookies to be sent to the server
      body: JSON.stringify(body)
    })

    // If authentication was not successful, try again
    if (response.status === 401) {
      // Tokens are invalid. Try getting new tokens
      await refreshTokens()
      // Got a new token pair. Try again
      return await fetchWithAuth(address, method, recursionLimit - 1, body)
    }

    // Authentication was successful. Returned the parsed response
    return await response.json() as T
  } catch (err) {
    throw err
  }
}