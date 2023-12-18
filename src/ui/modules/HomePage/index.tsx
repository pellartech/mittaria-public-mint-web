/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import { MintLive, MintStart } from './components'
import { IS_STARTED_MINTING } from '@/enums'
import { MintService } from '@/services'
import { ConnectorData, useAccount } from 'wagmi'
import Header from '@/ui/components/common/Header'
import { isEmpty } from 'lodash'
import VideoLoader from './components/VideoLoader'

const Home = () => {
  const { connector: activeConnector } = useAccount()
  const { phaseInfo, phaseInfoNext } = MintService()
  const [isStartedMinting, setIsStartedMinting] = useState(
    IS_STARTED_MINTING.NOT_STARTED
  )
  const [videosLoaded, setVideosLoaded] = useState(false)

  useEffect(() => {
    // Live phase
    if (phaseInfo?.isActive) {
      setIsStartedMinting(IS_STARTED_MINTING.LIVE)
      return
    }
    // Upcoming Phase
    if (!phaseInfo?.isActive && !isEmpty(phaseInfoNext?.detail)) {
      setIsStartedMinting(IS_STARTED_MINTING.NOT_STARTED)
      return
    }
    // Phase cycle complete
    if (!phaseInfo?.isActive && !phaseInfoNext.phaseId) {
      setIsStartedMinting(IS_STARTED_MINTING.LIVE)
    }
    
  }, [phaseInfo, phaseInfoNext])

  return (
    <>
      <VideoLoader onLoaded={() => setVideosLoaded(true)} />
      {!isEmpty(phaseInfo) && videosLoaded && (
        <>
          {isStartedMinting === IS_STARTED_MINTING.NOT_STARTED ? (
            <MintStart
              onSetMintLive={() => setIsStartedMinting(IS_STARTED_MINTING.LIVE)}
            />
          ) : (
            <>
              <Header />
              <MintLive />
            </>
          )}
        </>
      )}
    </>
  )
}

export default Home
