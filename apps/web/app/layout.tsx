import "@workspace/ui/globals.css"
import { Toaster } from "@workspace/ui/components/sonner"

import {
  TanstackProvider,
  ThemeProvider,
} from "@/app/providers"
import { Pretendard } from "@/app/fonts"
import "@/app/styles/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${Pretendard.variable} font-sans antialiased `}>
        <ThemeProvider>
          <TanstackProvider>
            {children}
          </TanstackProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
