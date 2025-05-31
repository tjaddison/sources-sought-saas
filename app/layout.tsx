import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { Auth0Provider } from '@auth0/nextjs-auth0'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'GovCon Agent | Your AI-powered companion for federal contract success',
  description: 'Discover, pursue, and win more government contracts with less effort using our AI-powered companion for federal contractors.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans`}>
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  )
} 