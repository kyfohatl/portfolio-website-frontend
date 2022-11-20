import { wait } from "@testing-library/user-event/dist/utils"
import throttle from "../../../lib/helpers/throttle"

const DURATION = 10
const cb = jest.fn()
const throttledCb = throttle(cb, DURATION)

beforeEach(async () => {
  // Wait the throttle duration to ensure any calls from a previous test are cleared
  await wait(DURATION + 5)
  // Reset the mock callback
  cb.mockReset()
})

describe("When the function is called just once", () => {
  it("Immediately calls the function", () => {
    throttledCb()
    expect(cb).toHaveBeenCalledTimes(1)
  })
})

describe("When the calls are more than the throttle duration apart", () => {
  it("Calls the function every time", async () => {
    throttledCb()
    await wait(DURATION + 5)
    throttledCb()
    await wait(DURATION + 5)
    throttledCb()
    await wait(DURATION + 5)
    expect(cb).toHaveBeenCalledTimes(3)
  })
})

describe("When the calls are all within one throttle duration", () => {
  it("Calls the function once at the start, then once again after the duration", async () => {
    throttledCb()
    throttledCb()
    throttledCb()
    throttledCb()
    throttledCb()
    expect(cb).toHaveBeenCalledTimes(1)
    await wait(DURATION + 5)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})

describe("When there are multiple calls within one throttle duration, then followed by another after the duration", () => {
  it("Calls the function once at the start, then again at the end of the duration, then once again after a second duration has passed", async () => {
    throttledCb()
    throttledCb()
    throttledCb()
    throttledCb()
    throttledCb()
    // Should be called once at the start
    expect(cb).toHaveBeenCalledTimes(1)

    await wait(DURATION + 5)
    // Now again that the duration has passed
    expect(cb).toHaveBeenCalledTimes(2)

    // Now calling the function again should not call the callback
    throttledCb()
    throttledCb()
    throttledCb()
    expect(cb).toHaveBeenCalledTimes(2)

    await wait(DURATION + 5)
    // And now one more time after a second duration
    expect(cb).toHaveBeenCalledTimes(3)
  })
})