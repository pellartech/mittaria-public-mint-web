'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MINTING_STATUS } from '@/enums'
import ArtMintingStatus from '@/ui/components/art-minting-status'
import { useAccount, useConnect } from 'wagmi'
import { MintService } from '@/services'
import { isEmpty, map, padStart, some } from 'lodash'
import CountDownMint from '../CountDownMint/CountDownMint'
import MintCard from './MintCard'
import SoldOut from '../SoldOut/SoldOut'
import { toast } from 'react-toastify'
import ToastMessage from '@/ui/components/common/ToastMessage'
import { TOAST_MESSAGE } from '@/helpers'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'
import TwitterSvg from '@/assets/images/component/twitter'
import DiscordSvg from '@/assets/images/component/discord'
import MittariaSvg from '@/assets/images/component/mittaria'

declare global {
  interface Window {
    ethereum: any
  }
}

const TEXT_STEP = {
  [MINTING_STATUS.WALLET_NOT_CONNECTED]: 'Connect <br> <span>Wallet</span>',
  [MINTING_STATUS.WALLET_CONNECTING]: 'Connecting <br> <span>Wallet</span>',
  [MINTING_STATUS.LOADING]: 'Loading <br> ...',
  [MINTING_STATUS.ELIGIBLE]: 'You are <br> <span>Eligible</span>',
  [MINTING_STATUS.NOT_ELIGIBLE]: 'You are <br> <span>Ineligible</span>',
  [MINTING_STATUS.ENDED]: 'Mint <br> <span>Ended</span>',
  [MINTING_STATUS.MINTING]: 'Minting <br> ...',
  [MINTING_STATUS.MINTING_MAXIMUM]: 'Maximum <br> Minting',
  [MINTING_STATUS.SOLD_OUT]: '<span>Sold <br>Out</span>',
  [MINTING_STATUS.PHASE_SOLD_OUT]: '<span>Phase <br>Sold Out</span>'
}

const VISIBLE_CLASSES = {
  VISIBLE: 'opacity-100',
  HIDE: 'opacity-0'
}

const MintLive: React.FC = () => {
  const { address, isConnected } = useAccount()
  const {
    connect,
    connectors,
    isLoading: isLoadingConnect,
    pendingConnector,
    error
  } = useConnect()

  const {
    totalSupply,
    soldNumber,
    whitelist,
    phaseInfo,
    tokenMintedByAccount
  } = MintService()

  const [step, setStep] = useState<MINTING_STATUS>(MINTING_STATUS.LOADING)
  const [showMintCard, setShowMintCard] = useState<boolean>(false)
  const [isSoldOut, setIsSoldOut] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)

  const refVideoWalletNotConnected = useRef<any>(null)
  const refVideoWalletConnecting = useRef<any>(null)
  const refVideoLoading = useRef<any>(null)
  const refVideoEligible = useRef<any>(null)
  const refVideoNotEligible = useRef<any>(null)
  const refVideoMinting = useRef<any>(null)
  const refVideoMintingMaximum = useRef<any>(null)
  const refVideoEnded = useRef<any>(null)

  useEffect(() => {
    if (step === MINTING_STATUS.MINTING) return

    // phase sold out
    if (phaseInfo?.phaseTotalMinted >= phaseInfo?.detail?.quantity) {
      setShowMintCard(false)
      setStep(MINTING_STATUS.PHASE_SOLD_OUT)
      return
    }

    if (Number(soldNumber) >= Number(totalSupply)) {
      setShowMintCard(false)
      setStep(MINTING_STATUS.SOLD_OUT)
      setIsSoldOut(true)
      return
    }

    if (!phaseInfo?.isActive) {
      setShowMintCard(false)
      setStep(MINTING_STATUS.ENDED)
      return
    }

    if (!address) {
      setStep(MINTING_STATUS.WALLET_NOT_CONNECTED)
      return
    }

    if (isEmpty(whitelist)) {
      setStep(MINTING_STATUS.LOADING)
    }

    let maxAmount = null

    if (!isEmpty(whitelist) && whitelist?.max_amount > 0) {
      maxAmount = whitelist?.max_amount
    }

    if (maxAmount && Number(tokenMintedByAccount) >= maxAmount) {
      setStep(MINTING_STATUS.MINTING_MAXIMUM)
      return
    }

    if (maxAmount && Number(tokenMintedByAccount) < maxAmount) {
      setStep(MINTING_STATUS.ELIGIBLE)
      return
    }

    if (whitelist?.max_amount === 0) {
      setStep(MINTING_STATUS.NOT_ELIGIBLE)
      return
    }
  }, [address, phaseInfo, whitelist, totalSupply, soldNumber, tokenMintedByAccount])

  useEffect(() => {
    if (isLoadingConnect || connectors?.[0]?.id === pendingConnector?.id) {
      setStep(MINTING_STATUS.WALLET_CONNECTING)
    }
  }, [isLoadingConnect, pendingConnector])

  useEffect(() => {
    if (isConnected) {
      setStep(MINTING_STATUS.LOADING)
    }
  }, [isConnected])

  useEffect(() => {
    switch (step) {
      case MINTING_STATUS.WALLET_NOT_CONNECTED: {
        if (isDesktop) {
          refVideoWalletNotConnected.current.currentTime = 0
          refVideoWalletNotConnected?.current?.play()
        }
        break
      }

      case MINTING_STATUS.WALLET_CONNECTING:
        {
          if (isDesktop) {
            refVideoWalletConnecting.current.currentTime = 0
            refVideoWalletConnecting?.current?.play()
          }
        }
        break

      case MINTING_STATUS.LOADING:
        {
          if (isDesktop) {
            refVideoLoading.current.currentTime = 0
            refVideoLoading?.current?.play()
          }
        }

        break

      case MINTING_STATUS.ELIGIBLE:
        {
          if (isDesktop) {
            refVideoEligible.current.currentTime = 0
            refVideoEligible?.current?.play()
          }
        }
        setTimeout(() => {
          setShowMintCard(true)
          setStep(MINTING_STATUS.MINTING)
        }, 2500)

        break

      case MINTING_STATUS.NOT_ELIGIBLE:
        {
          if (isDesktop) {
            refVideoNotEligible.current.currentTime = 0
            refVideoNotEligible?.current?.play()
          }
        }

        break

      case MINTING_STATUS.MINTING_MAXIMUM:
        if (isDesktop) {
          refVideoMintingMaximum.current.currentTime = 0
          refVideoMintingMaximum?.current?.play()
        }
        break

      case MINTING_STATUS.MINTING:
        {
          if (isDesktop) {
            refVideoMinting.current.currentTime = 0
            refVideoMinting?.current?.play()
          }
        }

        break

      case MINTING_STATUS.ENDED:
        if (isDesktop) {
          refVideoEnded.current.currentTime = 0
          refVideoEnded?.current?.play()
        }
        break

      default:
        break
    }
  }, [step, isTablet, isMobile])

  useEffect(() => {
    if (error?.message) {
      toast(
        <ToastMessage
          title='Connect Failed'
          status='error'
          className='text-white'
        >
          {error?.message}
        </ToastMessage>
      )
    }
  }, [error?.message])

  const handleConnectWallet = () => {
    if ((isMobile || isTablet) && !window?.ethereum) {
      window.open(
        `https://metamask.app.link/dapp/${window.location.href}`,
        '_blank',
        'rel=noopener noreferrer'
      )
      return
    }
    if (!window?.ethereum) {
      toast(
        <ToastMessage
          title='Connect Failed'
          status='error'
          className='text-white'
        >
          {TOAST_MESSAGE.wallet_not_found}
        </ToastMessage>
      )
      return
    }
    if (step === MINTING_STATUS.WALLET_NOT_CONNECTED) {
      {
        map(connectors, (connector) => {
          connect({ connector })
        })
      }
    }
  }

  const isShowing = (artStep: number[]) => {
    return some(artStep, (_step) => _step === step)
      ? VISIBLE_CLASSES.VISIBLE
      : VISIBLE_CLASSES.HIDE
  }

  return (
    <div className='mint-live w-full'>
      <div
        className={`check-eligible text-center flex flex-col items-center justify-center ${
          !showMintCard
            ? 'visible opacity-100 transition-opacity duration-500'
            : 'invisible opacity-0 transition-opacity duration-500'
        } ${isSoldOut ? 'hidden' : ''}`}
      >
        <div className='top-header'>
          <h1 className='title uppercase'>
            The Journey <br />
            Starts Here
          </h1>
        </div>
        <div className='center-content w-full relative'>
          <div
            className={`text-step text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer uppercase`}
            dangerouslySetInnerHTML={{ __html: TEXT_STEP[step] }}
            onClick={() => handleConnectWallet()}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={true}
            className={`${isShowing([MINTING_STATUS.WALLET_NOT_CONNECTED])}`}
            videoRef={refVideoWalletNotConnected}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={true}
            className={`${isShowing([MINTING_STATUS.WALLET_CONNECTING])}`}
            videoRef={refVideoWalletConnecting}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={true}
            className={`${isShowing([MINTING_STATUS.LOADING])}`}
            videoRef={refVideoLoading}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={false}
            className={`${isShowing([MINTING_STATUS.ELIGIBLE])}`}
            videoRef={refVideoEligible}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={false}
            className={`${isShowing([MINTING_STATUS.NOT_ELIGIBLE])}`}
            videoRef={refVideoNotEligible}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={true}
            autoPlay={true}
            className={`${isShowing([MINTING_STATUS.MINTING])}`}
            videoRef={refVideoMinting}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={false}
            className={`${isShowing([MINTING_STATUS.MINTING_MAXIMUM])}`}
            videoRef={refVideoMintingMaximum}
          />
          <ArtMintingStatus
            mintingStatus={step}
            loop={false}
            className={`${isShowing([
              MINTING_STATUS.ENDED,
              MINTING_STATUS.PHASE_SOLD_OUT
            ])}`}
            videoRef={refVideoEnded}
          />
        </div>

        <div className='bottom-time'>
          <div className='total-supply uppercase'>
            {padStart(String(soldNumber), 4, '0') || '0000'} /{' 2222'}
          </div>
          <div className='time-left'>
            <CountDownMint
              title='Mint Ends In'
              startTime={phaseInfo?.detail?.startTime}
              endTime={phaseInfo?.detail?.endTime}
              setCountDownEnd={() => setStep(MINTING_STATUS.ENDED)}
            />
          </div>
        </div>
      </div>
      <MintCard
        step={step}
        setStep={setStep}
        showMintCard={showMintCard}
        setShowMintCard={setShowMintCard}
        isSoldOut={isSoldOut}
        onMintSuccess={() => setMintSuccess(true)}
      />
      {mintSuccess && (
        <div className='flex justify-center absolute w-full bottom-0 lg:justify-end z-20'>
          <a
            href='https://mittaria.io/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <MittariaSvg />
          </a>
          <a
            href='https://twitter.com/Mittaria_Origin'
            target='_blank'
            rel='noopener noreferrer'
          >
            <TwitterSvg />
          </a>
          <a
            href='https://discord.gg/Mittaria'
            target='_blank'
            rel='noopener noreferrer'
          >
            <DiscordSvg />
          </a>
        </div>
      )}
      <SoldOut isSoldOut={isSoldOut} />
    </div>
  )
}

export default MintLive
