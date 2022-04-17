import { fetchWithAuth, redirectToSignInAndClearData } from "./auth.api"

export default class Api {
  static async signOut() {
    if (localStorage.getItem("refreshToken")) {
      try {
        const response = await fetch("http://localhost:8000/auth/users/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: localStorage.refreshToken })
        })

        if (response.ok) {
          redirectToSignInAndClearData()
        } else {
          // TODO
          console.error("Error: Refresh token is invalid")
        }
      } catch (err) {
        // TODO
        console.error("Error: could not submit sign out request to API", err)
      }
    }
  }

  // Saves the given blog to the database
  static async saveBlog(html: string, css: string) {
    try {
      await fetchWithAuth("http://localhost:8000/blog/create", "POST", { html: html, css: css }, 5)
    } catch (err) {
      // Could not save blog
      console.error(err)
    }
  }
}