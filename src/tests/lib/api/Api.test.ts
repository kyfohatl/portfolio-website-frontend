import { setupServer } from 'msw/node'
import { rest } from 'msw'
import Api from '../../../lib/api/Api'
import { FrontendError } from '../../../lib/commonTypes'
import { redirectToSignInAndClearData } from '../../../lib/api/helpers/auth/redirectAndClearData'

// Mock the auth api module
jest.mock("../../../lib/api/helpers/auth/redirectAndClearData")
const redirectToSignInAndClearDataMock = jest.mocked(redirectToSignInAndClearData, true)

// Mock the console object
const consoleErrMock = jest.spyOn(console, "error")

const BASE_PATH = process.env.REACT_APP_BACKEND_SERVER_ADDR
const USER_ID = "someUserId"

const server = setupServer(
  rest.delete(BASE_PATH + "auth/users/logout", (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post(BASE_PATH + "auth/login/facebook/callback", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: { userId: USER_ID }, code: 200 })
    )
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
  const ROUTE_PATH = "auth/users/logout"

  function itBehavesLikeRedirectAndClearData() {
    it("Redirects the user to the sign in page and deletes local data", () => {
      expect(redirectToSignInAndClearDataMock).toHaveBeenCalledTimes(1)
    })
  }

  describe("When the server successfully logs out the user", () => {
    beforeEach(async () => {
      // Send the request
      await Api.signOut()
    })

    itBehavesLikeRedirectAndClearData()
  })

  describe("When the server is unable to log out the user", () => {
    const ERROR_TEXT = "Something went wrong"

    beforeEach(async () => {
      // Setup the msw route
      server.use(
        rest.delete(BASE_PATH + ROUTE_PATH, (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ unknown: ERROR_TEXT }))
        })
      )
      // Make the api call
      await Api.signOut()
    })

    it("Outputs the error to console error", () => {
      expect(consoleErrMock).toHaveBeenCalledTimes(1)
      expect(consoleErrMock.mock.calls[0].includes(ERROR_TEXT)).toBe(true)
    })

    itBehavesLikeRedirectAndClearData()
  })
})

describe("postFacebookOpenIdCallback", () => {
  const ROUTE_PATH = "auth/login/facebook/callback"

  describe("When given \"null\" instead of a token id", () => {
    it("Throws an error with status code 400", async () => {
      const err = new FrontendError("No id token given!", 400)
      await expect(Api.postFacebookOpenIdCallback(null)).rejects.toThrowError(err)
    })
  })

  describe("When the given token id results in an unsuccessful response", () => {
    it("Throws an error with the received error response", async () => {
      const ERR_MESSAGE = "Something went wrong"

      // Setup the msw route
      server.use(
        rest.post(BASE_PATH + ROUTE_PATH, (req, res, ctx) => {
          return res(ctx.json({ simpleError: ERR_MESSAGE }))
        })
      )

      const err = new FrontendError(ERR_MESSAGE)
      await expect(Api.postFacebookOpenIdCallback("someInvalidId")).rejects.toThrowError(err)
    })
  })

  describe("When the given id results in a successful response but is missing a user id", () => {
    function itBehavesLikeInvalidSuccess(success: object | string | null) {
      it("Throws an error with code code 500", async () => {
        // Setup msw route
        server.use(
          rest.post(BASE_PATH + ROUTE_PATH, (req, res, ctx) => {
            return res(ctx.json({ success: success }))
          })
        )

        const err = new FrontendError("No user id present in response!", 500)
        await expect(Api.postFacebookOpenIdCallback("someInvalidId")).rejects.toThrowError(err)
      })
    }

    describe("When the success property is null", () => {
      itBehavesLikeInvalidSuccess(null)
    })

    describe("When the success property is is not an object", () => {
      itBehavesLikeInvalidSuccess("someInvalidSuccess")
    })

    describe("When the success property is an object but without a userId field", () => {
      itBehavesLikeInvalidSuccess({ invalid: "invalidProperty" })
    })
  })

  describe("When then given token id results in a successful response", () => {
    it("Returns the response with the user id", async () => {
      const response = await Api.postFacebookOpenIdCallback("someValidId")
      expect(response).toEqual({ success: { userId: USER_ID }, code: 200 })
    })
  })
})