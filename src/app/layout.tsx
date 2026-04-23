import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Allbotix — Robotics & Technology Services',
  description:
    'One team. One robot. Limitless possibilities. Empowering tomorrow\'s industries with cutting-edge robotic solutions by Allbotix.',
  keywords: [
    'robotics',
    'technology',
    'automation',
    'AI',
    'industrial robots',
    'allbotix',
  ],
  authors: [{ name: 'Allbotix Technologies' }],
  themeColor: '#00e5ff',
  openGraph: {
    title: 'Allbotix — Robotics & Technology Services',
    description:
      'Empowering tomorrow\'s industries with cutting-edge robotic solutions.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Favicon placeholder */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {/* Ambient background grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(176,58,46,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(176,58,46,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Ambient radial glow top-left */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '-20vh',
            left: '-10vw',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(176,58,46,0.07) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Ambient radial glow bottom-right */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: '-20vh',
            right: '-10vw',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(120,20,20,0.08) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Page content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}