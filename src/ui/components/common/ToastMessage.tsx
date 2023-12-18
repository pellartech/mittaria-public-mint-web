import { APP_ENVIRONMENTS } from '@/config'
import React, { useEffect, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { goerli, mainnet } from '@wagmi/chains'
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react'

interface ToastMessageProps {
  children: React.ReactNode
  status: 'success' | 'warning' | 'error' | 'info'
  title: string
  className?: string
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  children,
  status,
  title,
  className = ''
}) => {
  const iconStatus = useMemo(() => {
    switch (status) {
      case 'success':
        return <IconCheck size={24} className='text-green-500' />
      case 'error':
        return <IconX size={24} className='text-red-500' />
      default:
        return <IconInfoCircle size={24} />
    }
  }, [status])

  return (
    <div className={`toast-message ${className}`}>
      <div className='toast-header flex flex-row gap-2 items-center'>
        <div className={'icon-status'}>{iconStatus}</div>
        <div className='title font-bold'>{title}</div>
      </div>
      <div className='toast-body'>{children}</div>
    </div>
  )
}

export default ToastMessage
