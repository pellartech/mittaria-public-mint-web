import './globals.css'
import type { Metadata } from 'next'
import WagmiConfig from '@/lib/context/Wagmi'
import Head from 'next/head'
import { rootAssetUrl } from '@/helpers'
import GoogleAnalytics from './GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Mittaria Genesis',
  description: 'Welcome to Mittaria'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <Head>
        <link rel='preload' as='video' href={'/videos/VDO_T2_02.webm'} />
        <link rel='preload' as='video' href={'/videos/VDO_T2_03.webm'} />
        <link rel='preload' as='video' href={'/videos/VDO_T4_02.webm'} />
        <link rel='preload' as='video' href={'/videos/VDO_T1_01.webm'} />
        <link rel='preload' as='video' href={'/videos/VDO_T3_02.webm'} />
        <link rel='preload' as='video' href={'/videos/VDO_T5_01.webm'} />
        <link
          rel='preload'
          href={rootAssetUrl('VDO_Minting_01.mp4')}
          as='video'
        />
        <link
          rel='preload'
          href={rootAssetUrl('VDO_Minting_02_loop.mp4')}
          as='video'
        />
      </Head>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <WagmiConfig>{children}</WagmiConfig>
      </body>
    </html>
  )
}
