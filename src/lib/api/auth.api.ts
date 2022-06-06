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
      // Refresh token was not valid, redirect to the sign in page and remove data
      console.error("Error: Refresh token is not valid")
      redirectToSignInAndClearData()
      return false
    }

    const data = await response.json() as { success: { userId: string } }
    localStorage.setItem("userId", data.success.userId)
    return true
  } catch (err) {
    console.error("Error: Could not send refreshToken request", err)
    return false
  }
}

// Checks if jwt tokens are present in browser storage, and tries to refresh them if not. Returns true if tokens 
// are present at the end of the process, and false otherwise
// Note that this function - if it returns true - does not guarantee that the tokens present are valid
export async function areTokensPresentInStorage() {
  if (!hasData()) return await refreshTokens()
  return true
}

// Fetches the given address with the given method and the given request body, either throwing an error if
// unable to authenticate, or returning the data otherwise
export async function fetchWithAuth<T extends BackendResponse>(
  address: string,
  method: string,
  recursionLimit: number,
  body: Record<string, any> = {}
) {
  // Prevent infinite recursion
  if (recursionLimit <= 0) throw new Error("Error: fetchWithAuth recursion limit reached")

  // Ensure tokens are present in storage
  if (!await areTokensPresentInStorage()) throw new Error("Error: Unable to get new tokens")

  try {
    const response = await fetch(address, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + localStorage.getItem("accessToken")
      },
      credentials: "include", // To allow cookies to be sent to the server
      body: JSON.stringify(body)
    })

    let data: T

    // If authentication is unsuccessful, throw an error
    if (response.status === 401) {
      // Tokens are invalid. Try getting new tokens
      if (await refreshTokens()) {
        // Got a new token pair. Try again
        try {
          data = await fetchWithAuth(address, method, recursionLimit - 1, body)
        } catch (err) {
          throw err
        }
      } else {
        // Failed to get new tokens
        throw new Error("Error: Unable to get new tokens")
      }
    }

    // Return response, whether successful or not
    data = await response.json() as T
    return data
  } catch (err) {
    throw err
  }
}