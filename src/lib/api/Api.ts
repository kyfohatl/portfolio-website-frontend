import { BackendError, BackendResponse, FrontendError } from "../commonTypes"
import { fetchWithAuth, redirectToSignInAndClearData } from "./auth.api"

export interface BlogProps {
  id: string,
  userId: string,
  html: string,
  css: string,
  creationDate: string,
  summaryTitle: string,
  summaryDescription: string,
  summaryImg: string,
  tags: string[]
}

export default class Api {
  static async signOut() {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDR}auth/users/logout`, {
        method: "DELETE",
        credentials: "include" // To allow cookies to be deleted by the server
      })

      if (response.ok) {
        // Successfully deleted refresh token in database
        return redirectToSignInAndClearData()
      } else {
        // Could not delete refresh token from database
        const err = await response.json() as { unknown: unknown }
        console.error("Error: Refresh token is invalid", err.unknown)
        redirectToSignInAndClearData()
      }
    } catch (err) {
      // Could not perform fetch request
      console.error("Error: could not submit sign out request to API", err)
      redirectToSignInAndClearData()
    }
  }

  static async postFacebookOpenIdCallback(idToken: string | null) {
    // Make sure an openid client id token is present
    if (!idToken) throw new FrontendError("No id token given!", 400)

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDR}auth/login/facebook/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_token: idToken })
      })

      const data = await response.json() as BackendResponse

      // Ensure callback response was successful
      if (!("success" in data)) {
        throw FrontendError.backendErrorToFrontendError(data)
      }
    } catch (err) {
      throw new FrontendError("Failed to fetch", 500, err)
    }
  }

  static async getBlog(blogId: string) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDR}blog/` + blogId, {
        method: "GET"
      })

      return await response.json() as BackendResponse
    } catch (err) {
      // Could not fetch blog
      throw err
    }
  }

  // Saves the given blog to the database
  // If no blogId is supplied, a new blog will be created. Otherwise it will try to override the 
  // existing blog with the given id
  static async saveBlog(html: string, css: string, blogId?: string | null) {
    try {
      const response = await fetchWithAuth<{ success: { id: string } } | BackendError>(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDR}blog/create`,
        "POST",
        5,
        { html: html, css: css, blogId: blogId }
      )

      return response
    } catch (err) {
      // Unable to authenticate
      throw err
    }
  }

  static async getRecentBlogs(pageNum: number, limit: number) {
    try {
      const addr = `${process.env.REACT_APP_BACKEND_SERVER_ADDR}blog/?page=${pageNum}&limit=${limit}`
      const response = await fetch(addr, {
        method: "GET"
      })

      return await response.json() as BackendResponse
    } catch (err) {
      throw err
    }
  }

  static async deleteBlog(blogId: string) {
    try {
      const response = fetchWithAuth<{ success: { id: string } } | BackendError>(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDR}blog/` + blogId,
        "DELETE",
        5
      )

      return response
    } catch (err) {
      throw err
    }
  }
}