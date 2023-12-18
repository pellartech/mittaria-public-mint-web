/* eslint-disable @next/next/no-img-element */
import React from 'react'
import mintImg from '../../../../../assets/images/home/mint@2x.png'
import logoMittariaGenesis from '../../../../../assets/images/home/logo-mittaria-genesis.png'
import wingLeft from '../../../../../assets/images/home/wing-left.png'
import wingRight from '../../../../../assets/images/home/wing-right.png'
import { MintService } from '@/services'
import CountDownMint from '../CountDownMint/CountDownMint'

interface MintStartProps {
  onSetMintLive: () => void
}

const MintStart: React.FC<MintStartProps> = ({ onSetMintLive }) => {
  const { phaseInfo, phaseInfoNext } = MintService()

  return (
    <div className='mint-start flex flex-col items-center justify-center text-center'>
      <img
        src={mintImg.src} //
        loading='lazy'
        alt='mint-img'
        className='mint-img'
      />
      <div className='start-in flex flex-row items-center justify-center'>
        <img
          src={wingLeft.src} //
          loading='lazy'
          alt='mint-img'
          className='wing wing-left'
        />
        {phaseInfo?.detail?.startTime ||
          (phaseInfoNext?.detail?.startTime && (
            <div className='time text-center'>
              <CountDownMint
                title='Starts In'
                startTime={
                  phaseInfo?.detail?.startTime ||
                  phaseInfoNext?.detail?.startTime
                }
                endTime={phaseInfo?.detail?.endTime || Infinity}
                setCountDownEnd={onSetMintLive}
              />
            </div>
          ))}
        <img
          src={wingRight.src} //
          loading='lazy'
          alt='mint-img'
          className='wing wing-right'
        />
      </div>
      <img
        src={logoMittariaGenesis.src} //
        loading='lazy'
        alt='mittaria-genesis'
        className='logo-mittaria-genesis'
      />
    </div>
  )
}

export default MintStart
