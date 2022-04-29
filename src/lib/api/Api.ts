import { fetchWithAuth, redirectToSignInAndClearData } from "./auth.api"

export interface BlogProps {
  id: string,
  userId: string,
  html: string,
  css: string,
  creationDate: string,
  summaryTitle: string,
  summaryDescription: string,
  summaryImg: string
}

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

  static async getBlog(blogId: string) {
    try {
      const response = await fetch("http://localhost:8000/blog/" + blogId, { method: "GET" })

      return await response.json() as { success?: { blog: BlogProps }, error?: { generic: unknown } }
    } catch (err) {
      // Could not fetch blog
      console.error(err)
    }
  }

  // Saves the given blog to the database
  // If no blogId is supplied, a new blog will be created. Otherwise it will try to override the 
  // existing blog with the given id
  static async saveBlog(html: string, css: string, blogId?: string | null) {
    try {
      const response = await fetchWithAuth<{ success?: { id: string }, error?: { generic: unknown } }>(
        "http://localhost:8000/blog/create",
        "POST",
        { html: html, css: css, blogId: blogId },
        5
      )

      return response
    } catch (err) {
      // Unable to authenticate
      console.error(err)
    }
  }
}