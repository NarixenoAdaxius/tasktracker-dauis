import type { AppProps } from 'next/app'
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import '@/app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  )
}