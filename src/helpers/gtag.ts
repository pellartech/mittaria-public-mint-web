import { APP_ENVIRONMENTS } from "@/config";

export const pageview = (url: string) => {
    if (window?.gtag) {
      window.gtag('config', APP_ENVIRONMENTS.GA_MEASUREMENT_ID, {
        page_path: url
      });
    }
  }
  
  interface GoogleAnalyticsEventProps {
    action: string
    category: string
    label: string
    value: string
  }
  
  export const event = ({ action, category, label, value }: GoogleAnalyticsEventProps) => {
    if (window?.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  }
  