import { useEffect, useRef } from 'react'

export function useStaggerReveal(selector = '.reveal-item', delay = 100) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const items = el.querySelectorAll(selector)
    if (items.length === 0) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((item, index) => {
          item.style.transitionDelay = `${index * delay}ms`
          item.classList.add('in')
        })
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [selector, delay])

  return ref
}
