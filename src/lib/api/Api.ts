import { areTokensPresentInStorage, redirectToSignInAndClearData, refreshTokens } from "./auth.api"

export default class Api {
  static async signOut() {
    if (localStorage.getItem("refreshToken")) {
      try {
        const response = await fetch("http://localhost:8000/auth/users/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({token: localStorage.refreshToken})
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
    // Ensure tokens are present in storage
    if (!await areTokensPresentInStorage()) return

    try {
      const response = await fetch("http://localhost:8000/blog/create", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({
          html: html,
          css: css
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Tokens are invalid. Try getting new tokens
          if (await refreshTokens()) {
            // Got a new token pair. Try again
            Api.saveBlog(html, css)
          } else {
            // Failed to get new tokens
            return
          }
        } else {
          // Some other problem
          console.error("Error: Unable to save blog", response.status, response.statusText)
        }
      }
    } catch (err) {
      // TODO
      console.error("Error: Could not send saveBlog request", err)
    }
  }
}