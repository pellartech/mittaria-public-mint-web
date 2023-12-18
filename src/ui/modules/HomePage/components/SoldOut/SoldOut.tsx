/* eslint-disable @next/next/no-img-element */
import React from 'react'
import logoMittariaGenesis from '../../../../../assets/images/home/logo-mittaria-genesis.png'
import soldOutImg from '../../../../../assets/images/home/sold-out.png'
import wingLeft from '../../../../../assets/images/home/wing-left.png'
import wingRight from '../../../../../assets/images/home/wing-right.png'

interface SoldOutProps {
  isSoldOut?: boolean
}

const SoldOut: React.FC<SoldOutProps> = ({ isSoldOut }) => {
  return (
    <div
      className={`sold-out flex flex-col items-center justify-center text-center ${
        isSoldOut ? '' : 'hidden'
      }`}
    >
      <div className='content flex flex-row items-end justify-center'>
        <img
          src={wingLeft.src} //
          loading='lazy'
          alt='mint-img'
          className='wing wing-left'
        />
        <div className='content-center flex flex-col items-center'>
          <img
            src={logoMittariaGenesis.src} //
            loading='lazy'
            alt='mittaria-genesis'
            className='logo-mittaria-genesis'
          />
          <img
            src={soldOutImg.src} //
            loading='lazy'
            alt='sold-out-img'
            className='sold-out-img'
          />
        </div>
        <img
          src={wingRight.src} //
          loading='lazy'
          alt='mint-img'
          className='wing wing-right'
        />
      </div>
      <div className='text-thanks text-white text-center mt-2.5 uppercase'>
        Thanks for your support
      </div>
    </div>
  )
}

export default SoldOut
