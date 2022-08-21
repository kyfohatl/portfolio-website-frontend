import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { redirectToSignInAndClearData } from '../../../lib/api/auth.api'
import Api from '../../../lib/api/Api'

// Mock the auth api module
jest.mock("../../../lib/api/auth.api")
const redirectToSignInAndClearDataMock = jest.mocked(redirectToSignInAndClearData, true)

// Mock the console object
const consoleErrMock = jest.spyOn(console, "error")


const BASE_PATH = process.env.REACT_APP_BACKEND_SERVER_ADDR
const server = setupServer(
  rest.delete(BASE_PATH + "auth/users/logout", (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

beforeAll(() => {
  // Start the mock service worker
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  // Close mock service worker
  server.close()
})

describe("singOut", () => {
  describe("When the server successfully logs out the user", () => {
    it("Redirects the user to the sign in page and deletes local data", async () => {
      // Send the request
      await Api.signOut()
      expect(redirectToSignInAndClearDataMock).toHaveBeenCalled()
    })
  })

  describe("When the server is unable to log out the user", () => {
    beforeEach(async () => {
      // Setup the msw route
      server.use(
        rest.delete(BASE_PATH + "auth/users/logout", (req, res, ctx) => {
          return res(ctx.status(400))
        })
      )
      // Make the api call
      await Api.signOut()
    })

    it("Outputs the error to console error", async () => {
      expect(consoleErrMock).toHaveBeenCalled()
    })

    it("Redirects the user to the sign in page and deletes local data", () => {
      expect(redirectToSignInAndClearDataMock).toHaveBeenCalledTimes(1)
    })
  })
})