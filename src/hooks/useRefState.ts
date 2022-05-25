import { useCallback, useRef, useState } from "react";

export default function useRefState<T>(initVal: T): [T, React.MutableRefObject<T>, (newVal: T) => void] {
  const [stateVal, setStateVal] = useState(initVal)
  const refVal = useRef(initVal)

  const setVal = useCallback((newVal: T) => {
    refVal.current = newVal
    setStateVal(newVal)
  }, [])

  return [stateVal, refVal, setVal]
}