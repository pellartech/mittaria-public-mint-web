/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react'
import { MINTING_STATUS } from '@/enums'
import Head from 'next/head'
import { isMobile, isTablet } from 'react-device-detect'

interface ArtMintingStatusProps {
  mintingStatus: string | number
  className?: string
  loop?: boolean
  autoPlay?: boolean
  videoRef: any
}

const ArtMintingStatus: React.FC<ArtMintingStatusProps> = ({
  mintingStatus,
  className,
  loop = false,
  videoRef = null
}) => {
  const videoUrl: any = useMemo(() => {
    switch (mintingStatus) {
      case MINTING_STATUS.WALLET_CONNECTING:
      case MINTING_STATUS.LOADING:
      case MINTING_STATUS.MINTING:
        return '/videos/VDO_T2_02.webm'
      case MINTING_STATUS.ELIGIBLE:
        return '/videos/VDO_T2_03.webm'
      case MINTING_STATUS.NOT_ELIGIBLE:
      case MINTING_STATUS.ENDED:
      case MINTING_STATUS.MINTING_MAXIMUM:
      case MINTING_STATUS.PHASE_SOLD_OUT:
        return '/videos/VDO_T4_02.webm'
      default:
        return '/videos/VDO_T1_01.webm'
    }
  }, [mintingStatus])

  const posterVideoUrl: any = useMemo(() => {
    switch (mintingStatus) {
      case MINTING_STATUS.WALLET_CONNECTING:
      case MINTING_STATUS.LOADING:
      case MINTING_STATUS.MINTING:
        return '/images/loading.png'
      case MINTING_STATUS.ELIGIBLE:
        return '/images/eligible.png'
      case MINTING_STATUS.NOT_ELIGIBLE:
      case MINTING_STATUS.ENDED:
      case MINTING_STATUS.MINTING_MAXIMUM:
      case MINTING_STATUS.PHASE_SOLD_OUT:
        return '/images/not_eligible.png'
      default:
        return '/images/connect_wallet.png'
    }
  }, [mintingStatus])

  return (
    <>
      {isMobile || isTablet ? (
        <img
          src={posterVideoUrl}
          alt=''
          className={`art-minting-status ${className}`}
        />
      ) : (
        <video
          ref={videoRef}
          key={videoUrl}
          muted
          loop={loop}
          playsInline
          preload='true'
          autoPlay={false}
          poster={posterVideoUrl}
          className={`art-minting-status ${className}`}
        >
          <source src={videoUrl} type='video/webm' />
        </video>
      )}
    </>
  )
}

export default ArtMintingStatus
