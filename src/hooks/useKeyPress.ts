import { useCallback, useEffect } from "react"

export interface KeyProps {
  key: string,
  callBack: () => void,
  combKeys?: {
    shift?: true,
    ctrl?: true,
    alt?: true
  }
}

export type useKeyPressProps = KeyProps[]

// Checks if the conditions in the given key prop are met by the given event, and runs callback function if so
function checkKeyPressAndRunCallback(keyProp: KeyProps, event: KeyboardEvent) {
  if (event.key.toLocaleLowerCase() === keyProp.key.toLocaleLowerCase()) {
    // The correct key has been pressed. Check for any combination keys
    if (keyProp.combKeys) {
      if (keyProp.combKeys.alt && !event.altKey) {
        // Alt combination was required but not pressed
        return
      }

      if (keyProp.combKeys.ctrl && !event.ctrlKey) {
        // Ctrl combination was required but not pressed
        return
      }

      if (keyProp.combKeys.shift && !event.shiftKey) {
        // Shift combination was required but not pressed
        return
      }
    }

    // The correct key has been pressed, along with any required combination keys. Call callback
    keyProp.callBack()
  }
}

export default function useKeyPress(keyProps: useKeyPressProps) {
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    for (const keyProp of keyProps) {
      checkKeyPressAndRunCallback(keyProp, event)
    }
  }, [keyProps])

  useEffect(() => {
    // Attach key listener
    document.addEventListener("keydown", onKeyDown)

    // Remove key listener
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])
}