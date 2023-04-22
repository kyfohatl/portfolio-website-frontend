import { useEffect } from "react"

function useElementVisibility(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log("Is VISIBLE!!!")
      }
    })

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [ref])
}

const abc = "https://www.phind.com/search?cache=2e4f7b2a-3061-44e0-8560-1ef80ee0af3c"