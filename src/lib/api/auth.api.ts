import { BackendResponse } from "../commonTypes"

// Returns true if user data is present in local storage, and false otherwise
export function hasData() {
  if (localStorage.getItem("userId")) return true
  return false
}

// Removes all locally stored (local storage) user data
export function deleteLocalData() {
  localStorage.removeItem("userId")
}

// Deletes local tokens and redirects to the sign in page
export function redirectToSignInAndClearData() {
  deleteLocalData()
  window.location.href = "http://localhost:3000/signin"
}

// Sends request for a new pair of jwt acc and ref tokens. If the request fails, 
// redirects to the sign in page and returns false, otherwise will return true
export async function refreshTokens() {
  try {
    const response = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    if (!response.ok) {
      // Refresh token was not valid, remove user data from storage and redirect to sign in page
      console.error("Error: Refresh token is not valid")
      return redirectToSignInAndClearData()
    }

    const data = await response.json() as { success: { userId: string } }
    localStorage.setItem("userId", data.success.userId)
  } catch (err) {
    console.error("Error: Could not send refreshToken request", err)
    throw err
  }
}

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