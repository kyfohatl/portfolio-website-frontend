import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BackendError, BackendResponse } from '../../../lib/commonTypes'
import { refreshTokens } from '../../../lib/api/auth.api'

// Mock the local storage setItem method
const setItemMock = jest.spyOn(Storage.prototype, "setItem")

// Mock the local storage removeItem method
const mockRemoveItem = jest.spyOn(Storage.prototype, "removeItem")

// Mock console error
const consoleErrMock = jest.spyOn(console, "error")

const BASE_PATH = process.env.REACT_APP_BACKEND_SERVER_ADDR
const USER_ID = "someUserId"

const server = setupServer(
  rest.post(BASE_PATH + "auth/token", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: { userId: USER_ID } } as BackendResponse)
    )
  })
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})

describe("refreshTokens", () => {
  const ROUTE = "auth/token"

  describe("When the client has a valid refresh token", () => {
    beforeEach(() => {
      setItemMock.mockReset()
    })

    it("Saves the user id the server responds with in local storage", async () => {
      await refreshTokens()
      expect(setItemMock).toHaveBeenCalledWith("userId", USER_ID)
    })
  })

  describe("When the client does not have a valid refresh token", () => {
    let locationSpy: jest.SpyInstance<Location, []>
    const setHrefMock = jest.fn((value: string) => { })

    // Run setups
    beforeEach(async () => {
      // Mock the window.location object
      locationSpy = jest.spyOn(window, "location", "get").mockImplementation(() => {
        return {
          set href(value: string) { setHrefMock(value) }
        } as Location
      })

      // Reset mocks
      consoleErrMock.mockReset()
      mockRemoveItem.mockReset()

      // Setup route
      server.use(
        rest.post(BASE_PATH + ROUTE, (req, res, ctx) => {
          return res(
            ctx.status(403),
            ctx.json({ simpleError: "Invalid refresh token", code: 403 } as BackendError)
          )
        })
      )

      // Send request
      await refreshTokens()
    })

    afterAll(() => {
      // Restore the window.location mock
      locationSpy.mockRestore()
    })

    it("Outputs an error to console error", () => {
      expect(consoleErrMock).toHaveBeenCalledWith("Error: Refresh token is not valid")
    })

    it("Clears client data", () => {
      expect(mockRemoveItem).toHaveBeenCalledWith("userId")
    })

    it("Redirects the client to the sign in page", () => {
      expect(setHrefMock).toHaveBeenCalledWith(process.env.REACT_APP_FRONTEND_SERVER_ADDR + "signin")
    })
  })
})