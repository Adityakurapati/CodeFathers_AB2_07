import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
<<<<<<< HEAD
        title: 'BloodConnect',
        description: 'Blood Donation & Emergency Help is a platform designed to connect blood donors with recipients in emergencies. It facilitates easy blood requests, donor registrations, and emergency contacts, ensuring timely and life-saving donations.',
        generator: 'v0.dev',
}

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode
}>) {
        return (
                <html lang="en">
                        <body>{children}</body>
                </html>
        )
=======
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
>>>>>>> ashish
}
