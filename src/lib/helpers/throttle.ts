export default function throttle<
  CallbackArgs extends any[],
  CallbackReturn
>(cb: (...args: CallbackArgs) => CallbackReturn, duration: number = 1000) {
  let shouldCall = true
  let waitingArgs: CallbackArgs | null = null

  function resetTimer() {
    setTimeout(() => {
      if (waitingArgs) {
        resetTimer()

        const returnVal = cb(...waitingArgs)
        waitingArgs = null

        return returnVal
      }

      shouldCall = true
    }, duration)
  }

  return (...args: CallbackArgs) => {
    if (shouldCall) {
      shouldCall = false

      resetTimer()

      return cb(...args)
    }

    waitingArgs = args
  }
}