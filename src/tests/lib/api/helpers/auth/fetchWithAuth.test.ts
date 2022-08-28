import { rest } from "msw"
import { setupServer } from "msw/node"
import { fetchWithAuth } from "../../../../../lib/api/helpers/auth/fetchWithAuth"
import { BackendResponse } from "../../../../../lib/commonTypes"
import { refreshTokens } from "../../../../../lib/api/helpers/auth/refreshToken"
import Updatable from "../../../../../lib/Updatable"

jest.mock("../../../../../lib/api/helpers/auth/refreshToken")
const refreshedTokensMock = jest.mocked(refreshTokens, true)

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})

const PATH = "http://someDomain.abc/somePath"
const METHOD = "POST"
const SUCCESSFUL_RESPONSE_BODY: BackendResponse = { success: "successfulResponse", code: 200 }

describe("fetchWithAuth", () => {
  describe("When authentication is successful", () => {
    beforeEach(() => {
      server.use(
        rest.post(PATH, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(SUCCESSFUL_RESPONSE_BODY)
          )
        })
      )
    })

    it("Returns the parsed response", async () => {
      const response = await fetchWithAuth<BackendResponse>(PATH, METHOD, 5)
      expect(response).toEqual(SUCCESSFUL_RESPONSE_BODY)
    })
  })

  describe("When the authentication is unsuccessful", () => {
    describe("When the tokens are refreshed successfully", () => {
      const responseContainer = new Updatable<{ success: string, code: number }>()

      beforeEach(async () => {
        // Setup the route
        server.use(
          // The first instance will respond with a 401 "unauthorized"
          rest.post(PATH, (req, res, ctx) => {
            return res.once(ctx.status(401))
          }),
          // From then on the server will respond with a successful authentication
          rest.post(PATH, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(SUCCESSFUL_RESPONSE_BODY)
            )
          })
        )

        // Reset and setup the refreshTokens mock to refresh tokens successfully
        refreshedTokensMock.mockReset().mockResolvedValue(true)

        // Call the function
        responseContainer.update(await fetchWithAuth<{ success: string, code: number }>(PATH, METHOD, 5))
      })

      it("Attempts to refresh the client access and refresh tokens", () => {
        expect(refreshedTokensMock).toHaveBeenCalledTimes(1)
      })

      it("Returns the response", () => {
        expect(responseContainer.getContent()).toEqual(SUCCESSFUL_RESPONSE_BODY)
      })
    })

    describe("When the tokens are not refreshed", () => {
      beforeEach(() => {
        // Setup the route so that authentication fails
        server.use(
          rest.post(PATH, (req, res, ctx) => {
            return res(ctx.status(401))
          })
        )
      })

      describe("When refreshTokens returns false", () => {
        beforeEach(() => {
          refreshedTokensMock.mockReset().mockResolvedValue(false)
        })

        it("Throws an error", async () => {
          await expect(fetchWithAuth<BackendResponse>(PATH, METHOD, 5)).rejects.toThrowError()
        })
      })

      describe("When refreshTokens throws an error", () => {
        const ERROR_TEXT = "someError"
        beforeEach(() => {
          refreshedTokensMock.mockReset().mockImplementation(async () => { throw new Error(ERROR_TEXT) })
        })

        it("Bubbles the error up", async () => {
          await expect(fetchWithAuth<BackendResponse>(PATH, METHOD, 5)).rejects.toThrowError(new Error(ERROR_TEXT))
        })
      })
    })
  })
})