import { TermsAndConditionsPage } from '@/ui/pages'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Welcome to Mittaria website run by Translucia Co., Ltd.'
}

export default function TermsAndConditions() {
  return (
    <main>
      <TermsAndConditionsPage />
    </main>
  )
}
