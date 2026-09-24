import { createBrowserRouter } from 'react-router'
import { RootFallback, RootLayout } from './layouts/RootLayout.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { RouteErrorPage } from './pages/RouteErrorPage.tsx'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: RootLayout,
      HydrateFallback: RootFallback,
      ErrorBoundary: RouteErrorPage,
      children: [
        { index: true, Component: HomePage },
        {
          path: 'services',
          lazy: { Component: async () => (await import('./pages/ServicesPage.tsx')).ServicesPage },
        },
        {
          path: 'services/:slug',
          lazy: { Component: async () => (await import('./pages/ServicePage.tsx')).ServicePage },
        },
        {
          path: 'calculator',
          lazy: { Component: async () => (await import('./pages/CalculatorPage.tsx')).CalculatorPage },
        },
        { path: 'prices', lazy: { Component: async () => (await import('./pages/PricesPage.tsx')).PricesPage } },
        { path: 'about', lazy: { Component: async () => (await import('./pages/AboutPage.tsx')).AboutPage } },
        { path: 'faq', lazy: { Component: async () => (await import('./pages/FaqPage.tsx')).FaqPage } },
        { path: 'contacts', lazy: { Component: async () => (await import('./pages/ContactsPage.tsx')).ContactsPage } },
        { path: 'requests', lazy: { Component: async () => (await import('./pages/RequestsPage.tsx')).RequestsPage } },
        { path: 'privacy', lazy: { Component: async () => (await import('./pages/PrivacyPage.tsx')).PrivacyPage } },
        { path: '*', lazy: { Component: async () => (await import('./pages/NotFoundPage.tsx')).NotFoundPage } },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
