import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './i18n/config'
import App from './App'
import './index.css'
import { ThemeSync } from '@/components/ThemeSync'
import { useUiStore } from '@/store/uiStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

function ThemeToaster() {
  const theme = useUiStore((s) => s.theme)
  return (
    <Toaster
      position="bottom-right"
      theme={theme === 'dark' ? 'dark' : 'light'}
      richColors
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <App />
      <ThemeToaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
