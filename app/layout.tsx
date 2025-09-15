import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyTools - Bookmark Manager',
  description: 'A powerful bookmark management tool for organizing your favorite websites and videos',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['bookmarks', 'productivity', 'tools', 'web app', 'PWA'],
  authors: [{ name: 'MyTools Team' }],
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyTools',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'MyTools',
    title: 'MyTools - Bookmark Manager',
    description: 'A powerful bookmark management tool for organizing your favorite websites and videos',
    images: ['/icons/icon-512x512.png'],
  },
  twitter: {
    card: 'summary',
    title: 'MyTools - Bookmark Manager',
    description: 'A powerful bookmark management tool for organizing your favorite websites and videos',
    images: ['/icons/icon-512x512.png'],
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="MyTools" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyTools" />
        <meta name="apple-mobile-web-app-orientation" content="portrait" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="shortcut icon" href="/icons/icon-72x72.png" />
        
        {/* Viewport for PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Lock orientation to portrait
              function lockOrientation() {
                if ('screen' in window && 'orientation' in window.screen) {
                  if ('lock' in window.screen.orientation) {
                    window.screen.orientation.lock('portrait').catch(function(error) {
                      console.log('Orientation lock failed:', error);
                    });
                  }
                }
              }
              
              // Try to lock orientation when page loads
              window.addEventListener('load', lockOrientation);
              
              // Also try when app becomes fullscreen (PWA install)
              document.addEventListener('fullscreenchange', lockOrientation);
              
              // Handle orientation change events
              window.addEventListener('orientationchange', function() {
                setTimeout(lockOrientation, 100);
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
