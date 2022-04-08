export default class Api {
  static hasTokens() {
    if (localStorage.accessToken || localStorage.refreshToken) return true
    return false
  }

  static deleteLocalTokens() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  static async signOut() {
    if (localStorage.refreshToken) {
      try {
        const response = await fetch("http://localhost:8000/auth/users/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({token: localStorage.refreshToken})
        })

        if (response.status !== 204) {
          // TODO
          console.error("Error: Refresh token is invalid")
        } else {
          Api.deleteLocalTokens()
        }
      } catch (err) {
        // TODO
        console.error("Error: could not submit signout request to API", err)
      }
    }
  }
}