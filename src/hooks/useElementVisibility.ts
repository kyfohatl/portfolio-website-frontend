import { useEffect, useState } from "react"

export function useElementVisibility(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      setIsVisible(entries[0].isIntersecting)
    }, {threshold: 0.1})

    const current = ref.current

    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [ref])

  return isVisible
}

const abc = "https://www.phind.com/search?cache=2e4f7b2a-3061-44e0-8560-1ef80ee0af3c"