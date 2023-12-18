'use client'

import { APP_ENVIRONMENTS } from '@/config'
import Script from 'next/script'
import * as gtag from "../helpers/gtag"

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${APP_ENVIRONMENTS.GA_MEASUREMENT_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== "undefined") {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${APP_ENVIRONMENTS.GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            }
          `
        }}
      />
    </>
  )
}

export default GoogleAnalytics
