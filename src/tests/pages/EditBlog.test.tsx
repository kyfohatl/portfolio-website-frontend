import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Api from "../../lib/api/Api"
import EditBlog from "../../pages/EditBlog"

describe("Create/Save blog button", () => {
  const BASE_PATH = "/editblog/"

  function setup(initRoute: string, path: string) {
    render(
      <MemoryRouter initialEntries={[initRoute]}>
        <Routes>
          <Route path={path} element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    )
  }

  describe("When there is no blog id in the page route params", () => {
    it("Displays a \"Create\" button instead of a \"Save\" button", () => {
      setup(BASE_PATH, BASE_PATH)
      const createBtn = screen.getByRole("button", { name: /Create/ })
      const saveBtn = screen.queryByRole("button", { name: /Save/ })

      expect(createBtn).toBeInTheDocument()
      expect(saveBtn).not.toBeInTheDocument()
    })

    it("Goes into a loading state when clicked on", () => {
      // First mock the Api.saveBlog method
      const saveBlogMock = jest.spyOn(Api, "saveBlog").mockImplementation(async () => {
        // Wait for a bit
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => { resolve() }, 500)
        })

        // Then return a fake successful response
        return { success: { id: "someBlogId" } }
      })

      setup(BASE_PATH, BASE_PATH)
      const createBtn = screen.getByRole("button", { name: /Create/ })
      fireEvent.click(createBtn)

      // Now get the loading button
      const loadingBtn = screen.getByRole("button", { name: /loading/i })
      expect(loadingBtn).toBeInTheDocument()
    })

    it.todo("Goes into a saving state once finished saving a blog")
  })

  describe("When there is a valid blog id in the page route params", () => { })

  describe("When there is an invalid blog id in the page route params", () => {
  })
})