import { BackendResponse } from "../../../lib/commonTypes"

export type TestBlogInfo = { userId: string, html: string, css: string }

// Create all given blogs in the given blogs list on the backend test server
export default class TestApi {
  async createBlogs(blogs: TestBlogInfo[]) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDR}test/blog/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ blogs })
      })

      return await response.json() as BackendResponse
    } catch (err) {
      throw err
    }
  }
}