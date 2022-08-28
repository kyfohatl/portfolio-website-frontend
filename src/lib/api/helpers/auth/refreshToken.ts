import { redirectToSignInAndClearData } from "./redirectAndClearData"

// Sends request for a new pair of jwt acc and ref tokens. If the request fails, 
// redirects to the sign in page and returns false, otherwise will return true
export async function refreshTokens() {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDR}auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    if (!response.ok) {
      // Refresh token was not valid, remove user data from storage and redirect to sign in page
      console.error("Error: Refresh token is not valid")
      redirectToSignInAndClearData()
      return false
    }

    const data = await response.json() as { success: { userId: string } }
    localStorage.setItem("userId", data.success.userId)
    return true
  } catch (err) {
    console.error("Error: Could not send refreshToken request", err)
    throw err
  }
}