import type { Metadata, Viewport } from 'next'
import './globals.css'
import { FlightRecorderProvider } from '@/components/FlightRecorderContext'
import FlightRecorderGlobal from '@/components/FlightRecorderGlobal'
import FlightRecorderModal from '@/components/FlightRecorderModal'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export const metadata: Metadata = {
  title: 'AugmentFlogger — Flight Instructor Dashboard',
  description: 'The premium augmentation tool for flight instructors using FlightLogger. Search, monitor, and track students seamlessly.',
  keywords: 'flight instructor, FlightLogger, aviation, student tracking, callsign',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AugmentFlogger',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/plane-favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <FlightRecorderProvider>
          {children}
          <FlightRecorderGlobal />
          <FlightRecorderModal />
        </FlightRecorderProvider>
      </body>
    </html>
  )
}
