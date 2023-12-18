/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  useAccount,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { MintService } from '@/services'
import { isEmpty, map } from 'lodash'
import { ethers } from 'ethers'
import nftCardImage from '../../../../../assets/images/home/nft-card.png'
import { MINTING_STATUS } from '@/enums'
import { TOAST_MESSAGE, rootAssetUrl } from '@/helpers'
import ToastMessage from '@/ui/components/common/ToastMessage'
import { toast } from 'react-toastify'
import AddButton from '@/assets/images/home/add_button.png'
import SubtractButton from '@/assets/images/home/subtract_button.png'
import { ThreeDots } from 'react-loader-spinner'
import { isDesktop } from 'react-device-detect'
import moment from 'moment'
import { publicClient } from '@/lib/context/Wagmi'

interface MintCardProps {
  showMintCard: boolean
  setShowMintCard: (showMintCard: boolean) => void
  isSoldOut?: boolean
  step: number
  setStep: (step: number) => void
  onMintSuccess: () => void
}

const AMOUNT_CHANGE_TYPE = {
  PLUS: 'plus',
  MINUS: 'minus'
}

const PHASE_IDS = {
  WHITE_LIST: [1, 2, 3],
  PUBLIC: 4
}

const MintCard: React.FC<MintCardProps> = ({
  showMintCard,
  setShowMintCard,
  isSoldOut,
  setStep,
  onMintSuccess
}) => {
  const {
    configContract,
    phaseInfo,
    whitelist,
    refetchSoldNumber,
    tokenMintedByAccount,
    accountBalance
  } = MintService()

  const { address, isDisconnected } = useAccount()

  const [amount, setAmount] = useState(1)
  const [price, setPrice] = useState<any>(0)
  const [unitPrice, setUnitPrice] = useState<string>('0.00')
  const [loadingMint, setLoadingMint] = useState(false)
  const [showVideoSuccess, setShowVideoSuccess] = useState(false)
  const [showVideoSuccessLoop, setShowVideoSuccessLoop] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [nftCards, setNftCards] = useState<number[]>([amount])
  const [isConfirmingTxn, setIsConfirmingTxn] = useState(false)

  const videoInitRef = useRef<any>(null)
  const videoMintingRef = useRef<any>(null)
  const videoSuccessRef = useRef<any>(null)
  const videoSuccessLoopRef = useRef<any>(null)
  const imageInitRef = useRef<any>(null)

  const isPublic = useMemo(
    () => phaseInfo?.phaseId === PHASE_IDS.PUBLIC,
    [phaseInfo]
  )

  useEffect(() => {
    if (isEmpty(phaseInfo)) return
    setPrice(phaseInfo?.detail?.price)
    setUnitPrice(ethers.utils.formatEther(phaseInfo?.detail?.price || '0'))
  }, [phaseInfo])

  useEffect(() => {
    if (!address || !isDisconnected) {
      setStep(MINTING_STATUS.WALLET_NOT_CONNECTED)
      setShowMintCard(false)
      setShowContent(false)
    }
  }, [address, isDisconnected])

  const {
    data: mintTxn,
    error: mintError,
    write
  } = useContractWrite({
    ...configContract,
    functionName: 'mint',
    value: BigInt(price || '0') * BigInt(amount || '0')
  })

  const {
    isError: waitTxnError, //
    isLoading: waitTxnConfirm,
    isSuccess: waitTxnSuccess
  } = useWaitForTransaction({
    hash: mintTxn?.hash
  })

  useEffect(() => {
    if (waitTxnSuccess) {
      refetchSoldNumber()
      setTimeout(() => {
        setShowVideoSuccess(true)
        videoSuccessRef.current.currentTime = 0
        videoSuccessRef.current.play()
        onMintSuccess()
      }, 5000)
    }
  }, [waitTxnSuccess])

  useEffect(() => {
    if (mintError || waitTxnError) {
      try {
        setIsConfirmingTxn(false)
        const mintErrorMsg = JSON.parse(JSON.stringify(mintError))
        const waitTxnErrorMsg = JSON.parse(JSON.stringify(waitTxnError))
        setLoadingMint(false)
        setShowMintCard(true)
        setShowContent(true)

        toast(
          <ToastMessage
            title='Transaction Failed'
            status='error'
            className='text-white'
          >
            {mintErrorMsg?.shortMessage || waitTxnErrorMsg?.shortMessage}
          </ToastMessage>
        )
      } catch (error) {
        toast(
          <ToastMessage title='Transaction Failed' status='error'>
            {TOAST_MESSAGE.unknown_error}
          </ToastMessage>
        )
      }
    }
  }, [mintError, waitTxnError])

  useEffect(() => {
    if (waitTxnConfirm) {
      setLoadingMint(true)

      if (isDesktop) {
        videoMintingRef.current.currentTime = 0
        videoMintingRef.current.play()
      }

      setTimeout(() => {
        setShowContent(false)
        // setStep(MINTING_STATUS.MINTING)
      }, 2000)

      setTimeout(() => {
        setShowMintCard(false)
      }, 5000)
    }
  }, [waitTxnConfirm])

  useEffect(() => {
    if (showVideoSuccess) {
      setTimeout(() => {
        setShowVideoSuccessLoop(true)
      }, 33000)
      videoSuccessLoopRef.current.currentTime = 0
    }
  }, [showVideoSuccess])

  useEffect(() => {
    if (showMintCard) {
      if (videoInitRef.current) {
        videoInitRef.current.currentTime = 0
        videoInitRef.current.play()
      }

      const timeSecond = isDesktop ? 3000 : 100
      setTimeout(() => {
        setShowContent(true)
      }, timeSecond)
    }
  }, [showMintCard])

  const handleAmountChange = (type: string) => {
    const maxAmount = whitelist?.max_amount || 0
    const formatPrice = ethers.BigNumber.from(price || 0)
    if (type === AMOUNT_CHANGE_TYPE.PLUS) {
      if (amount < maxAmount) {
        setAmount(amount + 1)
        setNftCards([...nftCards, amount + 1])
        setUnitPrice(
          ethers.utils.formatEther(formatPrice.mul(amount + 1)).toString()
        )
      }
    } else if (type === AMOUNT_CHANGE_TYPE.MINUS) {
      if (amount > 1) {
        setAmount(amount - 1)
        setNftCards([...nftCards.slice(0, nftCards.length - 1)])
        setUnitPrice(
          ethers.utils.formatEther(formatPrice.mul(amount - 1)).toString()
        )
      }
    }
  }

  const handleMint = async () => {
    const balance = Number(accountBalance?.formatted).toFixed(4)

    if (unitPrice > balance) {
      toast(
        <ToastMessage
          title='Insufficient balance'
          status='error'
          className='text-white'
        >
          {TOAST_MESSAGE.insufficient_balance}
        </ToastMessage>
      )
      return
    }

    const tokenRemaining =
      Number(whitelist?.max_amount) - Number(tokenMintedByAccount)
    if (amount > tokenRemaining) {
      toast(
        <ToastMessage
          title='Exceed max amount'
          status='error'
          className='text-white'
        >
          {`You can only mint ${Math.max(tokenRemaining, 0)} token(s)`}
        </ToastMessage>
      )
      return
    }
    setIsConfirmingTxn(true)

    const currentUtcUnixTime = moment.utc().unix()
    const startTime = phaseInfo?.detail?.startTime || 0
    if (currentUtcUnixTime < startTime) {
      toast(
        <ToastMessage
          title='Not started yet'
          status='error'
          className='text-white'
        >
          {`Minting will start at ${moment
            .unix(startTime)
            .format('DD MMM YYYY HH:mm:ss')}`}
        </ToastMessage>
      )
      return
    }

    try {
      const estimateContractGas = await publicClient({})?.estimateContractGas({
        ...configContract,
        functionName: 'mint',
        value: BigInt(price || '0') * BigInt(amount || '0'),
        args: [
          BigInt(phaseInfo?.phaseId),
          amount,
          whitelist?.max_amount,
          whitelist?.signature
        ],
        account: address!
      })

      write({
        args: [
          BigInt(phaseInfo?.phaseId),
          amount,
          whitelist?.max_amount,
          whitelist?.signature
        ],
        gas: (estimateContractGas * BigInt(150)) / BigInt(100)
      })
    } catch (error) {
      toast(
        <ToastMessage
          title='Transaction Failed'
          status='error'
          className='text-white'
        >
          {TOAST_MESSAGE.unknown_error}
        </ToastMessage>
      )
    }
  }

  const classNameShowContent = () => {
    return showContent
      ? 'visible opacity-100 transition-opacity duration-500'
      : 'invisible opacity-0 transition-opacity duration-500'
  }

  return (
    <>
      <div
        className={`mint-card text-center flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 ${
          showMintCard ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {!isDisconnected && (
          <div className='section-mint flex flex-col items-center justify-center relative'>
            <div
              className={`nft-cards flex flex-row flex-wrap items-center justify-center gap-2.5 md:gap-14 absolute left-1/2 transform -translate-x-1/2 z-20 ${classNameShowContent()} ${
                !isPublic ? 'mt-[1%]' : ''
              }`}
            >
              {map(nftCards, (nftCard) => {
                return (
                  <img
                    src={nftCardImage.src}
                    key={nftCard}
                    loading='lazy'
                    alt='nft-card'
                    className='nft-image shrink-0'
                  />
                )
              })}
            </div>
            <div className='mint-card-video absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
              {isDesktop ? (
                <video
                  ref={videoInitRef}
                  key={1}
                  muted
                  loop={false}
                  playsInline
                  autoPlay={false}
                  className={`video w-full h-full object-cover ${
                    loadingMint ? 'hidden' : ''
                  }`}
                >
                  <source src={'/videos/VDO_T3_02.webm'} type='video/webm' />
                </video>
              ) : (
                <img
                  src='/images/minting_card.png'
                  alt=''
                  className='w-full h-full object-cover'
                  ref={imageInitRef}
                />
              )}

              {isDesktop && (
                <video
                  ref={videoMintingRef}
                  key={2}
                  muted
                  loop={false}
                  playsInline
                  autoPlay={false}
                  className={`video w-full h-full object-cover ${
                    loadingMint ? '' : 'hidden'
                  }`}
                >
                  <source src={'/videos/VDO_T5_01.webm'} type='video/webm' />
                </video>
              )}
            </div>

            {isPublic && (
              <>
                <button
                  className={`button-amount button-minus absolute z-10 ${classNameShowContent()}`}
                  onClick={() => handleAmountChange(AMOUNT_CHANGE_TYPE.MINUS)}
                >
                  <img src={SubtractButton.src}></img>
                </button>
                <button
                  className={`button-amount button-plus absolute z-10 ${classNameShowContent()}`}
                  onClick={() => handleAmountChange(AMOUNT_CHANGE_TYPE.PLUS)}
                >
                  <img src={AddButton.src}></img>
                </button>
                <div
                  className={`eth-price font-medium absolute z-10 ${classNameShowContent()}`}
                >
                  {unitPrice || '0.00'} ETH
                </div>
              </>
            )}
            <div
              className={`amount font-medium absolute z-10 ${classNameShowContent()}`}
            >
              {isPublic ? amount : `${unitPrice} ETH`}
            </div>

            <button
              className={`button-mint uppercase rounded-full cursor-pointer absolute z-10 ${classNameShowContent()}`}
              disabled={loadingMint || isSoldOut || isConfirmingTxn}
              onClick={() => handleMint()}
            >
              {isConfirmingTxn ? (
                <ThreeDots
                  height='60'
                  width='60'
                  radius='9'
                  color='white'
                  ariaLabel='three-dots-loading'
                  wrapperStyle={{ justifyContent: 'center' }}
                  visible={true}
                />
              ) : (
                'Mint'
              )}
            </button>
          </div>
        )}
      </div>
      <video
        ref={videoSuccessRef}
        key={3}
        muted
        loop={false}
        playsInline
        autoPlay={false}
        className={`fixed top-0 left-0 w-screen h-screen z-20 ${
          showVideoSuccess
            ? 'visible transition-opacity duration-500 bg-black opacity-100'
            : 'invisible  transition-opacity opacity-0'
        }`}
      >
        <source src={rootAssetUrl('VDO_Minting_01.mp4')} />
      </video>
      <video
        ref={videoSuccessLoopRef}
        key={4}
        muted
        loop={true}
        playsInline
        autoPlay={true}
        className={`fixed top-0 left-0 w-screen h-screen bg-black z-20 ${
          showVideoSuccessLoop
            ? 'visible transition-opacity duration-500 opacity-100'
            : 'invisible  transition-opacity opacity-0'
        }`}
      >
        <source src={rootAssetUrl('VDO_Minting_02_loop.mp4')} />
      </video>
    </>
  )
}

export default MintCard
