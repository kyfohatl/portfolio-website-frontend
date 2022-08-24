import Api from "../../../lib/api/Api"

const USERNAME = "someUsername"
const PASSWORD = "somePassword"

beforeAll(async () => {
  // Create a test user
  const response = await Api.signUp(USERNAME, PASSWORD)
  console.log(response.headers)
})

afterAll(async () => {
  // Delete test user
  const response = await Api.deleteUser(USERNAME)
  console.log(response)
})

describe("signOut", () => {
  describe("When the client has a valid refresh token", () => {
    it("Deletes the client refresh token from the database", async () => {
    })

    it.todo("Redirects client to the sign in page and clears client data")
  })

  describe("When the client has an invalid refresh token", () => { })

  describe("When the client has no refresh token", () => { })
})