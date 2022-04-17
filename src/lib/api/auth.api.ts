 // Returns true if access and refresh tokens are present in local storage, and false otherwise
 export function hasTokens() {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) return true
    return false
  }

  // Removes all locally stored tokens
  export function deleteLocalTokens() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  // Deletes local tokens and redirects to the sign in page
  export function redirectToSignInAndClearData() {
    deleteLocalTokens()
    window.location.href = "http://localhost:3000/signin"
  }

  // Places a new jwt token pair in local storage if the current refresh token is valid and returns true, or 
  // redirects to the sign in page and returns false otherwise
  export async function refreshTokens() {
    // Make sure we actually have a refresh token
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      redirectToSignInAndClearData()
      return false
    }

    try {
      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({token: refreshToken})
      })

      if (!response.ok) {
        // Refresh token was not valid, redirect to the sign in page and remove data
        console.error("Error: Refresh token is not valid")
        redirectToSignInAndClearData()
        return false
      }

      const data = await response.json() as {success: {accessToken: string, refreshToken: string}}
      localStorage.setItem("accessToken", data.success.accessToken)
      localStorage.setItem("refreshToken", data.success.refreshToken)
      return true
    } catch (err) {
      // TODO
      console.error("Error: Could not send refreshToken request", err)
      return false
    }
  }

  // Checks if jwt tokens are present in browser storage, and tries to refresh them if not. Returns true if tokens 
  // are present at the end of the process, and false otherwise
  // Note that this function - if it returns true - does not guarantee that the tokens present are valid
  export async function areTokensPresentInStorage() {
    if (!hasTokens()) return await refreshTokens()
    return true
  }