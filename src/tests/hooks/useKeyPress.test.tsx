import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import useKeyPress, { KeyProps } from "../../hooks/useKeyPress"

function setup(keyProps: KeyProps) {
  function Sample() {
    useKeyPress([keyProps])
    return <div>Sample</div>
  }

  render(<Sample />)
}

const callbackMock = jest.fn()
beforeEach(() => {
  callbackMock.mockReset()
})

function itBehavesLikeCallCallback(keyProps: KeyProps, eventStr: string) {
  it("Calls the callback function once when the correct key is pressed once", () => {
    setup(keyProps)
    userEvent.keyboard(eventStr)
    expect(callbackMock).toHaveBeenCalledTimes(1)
  })

  it("Calls the callback function multiple times when the correct key is pressed multiple times", () => {
    setup(keyProps)
    userEvent.keyboard(eventStr)
    userEvent.keyboard(eventStr)
    expect(callbackMock).toHaveBeenCalledTimes(2)
  })
}

describe("When given no combination keys", () => {
  const KEY = "k"

  itBehavesLikeCallCallback({ key: KEY, callBack: callbackMock }, KEY)

  it("Does not call the callback function when the incorrect key is pressed", () => {
    setup({ key: KEY, callBack: callbackMock })

    userEvent.keyboard("x")
    userEvent.keyboard("L")
    userEvent.keyboard("{esc}")
    userEvent.keyboard("{arrowleft}")

    expect(callbackMock).not.toHaveBeenCalled()
  })
})

function itBehavesLikeCombKeyNotPressed(keyProps: KeyProps, otherCombos: string[]) {
  it("Does not call the callback function when the correct key is pressed without the combination key(s)", () => {
    setup(keyProps)

    // Press the key by itself
    userEvent.keyboard(keyProps.key)
    // Press the key with other invalid combination keys
    for (const invalidCombo of otherCombos) {
      userEvent.keyboard(invalidCombo)
    }

    expect(callbackMock).not.toHaveBeenCalled()
  })
}

describe("When given only the \"shift\" key", () => {
  const KEY = "L"
  const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { shift: true } }
  itBehavesLikeCallCallback(KEY_PROPS, `{shift}${KEY}`)
  itBehavesLikeCombKeyNotPressed(KEY_PROPS, [`{ctrl}${KEY}`, `{alt}${KEY}`, `{ctrl}{alt}${KEY}`])
})

describe("When given only the \"ctrl\" key", () => {
  const KEY = "F"
  const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { ctrl: true } }
  itBehavesLikeCallCallback(KEY_PROPS, `{ctrl}${KEY}`)
  itBehavesLikeCombKeyNotPressed(KEY_PROPS, [`{shift}${KEY}`, `{alt}${KEY}`, `{shift}{alt}${KEY}`])
})

describe("When given only the \"alt\" key", () => {
  const KEY = "D"
  const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { alt: true } }
  itBehavesLikeCallCallback(KEY_PROPS, `{alt}${KEY}`)
  itBehavesLikeCombKeyNotPressed(KEY_PROPS, [`{shift}${KEY}`, `{ctrl}${KEY}`, `{shift}{ctrl}${KEY}`])
})

describe("When multiple combination keys are pressed", () => {
  const KEY = "w"
  const BASE_INVALID_COMBS = [`{shift}${KEY}`, `{ctrl}${KEY}`, `{alt}${KEY}`]

  describe("When shift and ctrl are pressed", () => {
    const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { shift: true, ctrl: true } }
    itBehavesLikeCallCallback(KEY_PROPS, `{shift}{ctrl}${KEY}`)
    itBehavesLikeCombKeyNotPressed(
      KEY_PROPS,
      [...BASE_INVALID_COMBS, `{shift}{alt}${KEY}`, `{ctrl}{alt}${KEY}`]
    )
  })

  describe("When shit and alt are pressed", () => {
    const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { shift: true, alt: true } }
    itBehavesLikeCallCallback(KEY_PROPS, `{shift}{alt}${KEY}`)
    itBehavesLikeCombKeyNotPressed(
      KEY_PROPS,
      [...BASE_INVALID_COMBS, `{shift}{ctrl}${KEY}`, `{ctrl}{alt}${KEY}`]
    )
  })

  describe("When ctrl and alt are pressed", () => {
    const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { ctrl: true, alt: true } }
    itBehavesLikeCallCallback(KEY_PROPS, `{ctrl}{alt}${KEY}`)
    itBehavesLikeCombKeyNotPressed(
      KEY_PROPS,
      [...BASE_INVALID_COMBS, `{shift}{ctrl}${KEY}`, `{shift}{alt}${KEY}`]
    )
  })

  describe("When all three combination keys are pressed", () => {
    const KEY_PROPS: KeyProps = { key: KEY, callBack: callbackMock, combKeys: { shift: true, ctrl: true, alt: true } }
    itBehavesLikeCallCallback(KEY_PROPS, `{shift}{ctrl}{alt}${KEY}`)
    itBehavesLikeCombKeyNotPressed(
      KEY_PROPS,
      [...BASE_INVALID_COMBS, `{shift}{ctrl}${KEY}`, `{shift}{alt}${KEY}`, `{ctrl}{alt}${KEY}`]
    )
  })
})