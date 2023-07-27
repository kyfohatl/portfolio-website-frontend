import { useEffect, useState } from "react"

// Keeps track of whether an element represented by the given ref is visible on the screen or not
export function useElementVisibility(ref: React.RefObject<HTMLElement | SVGElement>) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      setIsVisible(entries[0].isIntersecting)
    }, { threshold: 0.1 })

    const current = ref.current

    if (current) observer.observe(current)

    // Remove the element from the observer upon unmounting
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [ref])

  return isVisible
}