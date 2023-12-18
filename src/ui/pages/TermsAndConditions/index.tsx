/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className='terms-and-conditions w-full h-screen text-white'>
      <img
        src='/images/termsAndConditions/genesis-logo.png'
        alt=''
        className='pt-5 pl-5 mb-3'
      />
      <div className='container mx-auto'>
        <h1 className='text-center'>Website Terms Of Use</h1>
        <div className='mx-auto mt-20 text-center'>
          <button>Creator registration</button>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
