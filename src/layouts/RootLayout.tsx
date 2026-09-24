import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { BackToTop } from '../components/BackToTop/BackToTop.tsx'
import { Footer } from '../components/Footer/Footer.tsx'
import { Header } from '../components/Header/Header.tsx'
import { RequestDialog } from '../components/RequestDialog/RequestDialog.tsx'
import { Toaster } from '../components/Toaster/Toaster.tsx'

export function RootLayout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname
    if (hash) return

    const main = mainRef.current
    const target = main?.querySelector<HTMLElement>('h1') ?? main
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }, [pathname, hash])

  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!target) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <RequestDialog />
      <Toaster />
      <BackToTop />
      <ScrollRestoration />
    </>
  )
}

export function RootFallback() {
  return <div style={{ minHeight: '100dvh' }} />
}
