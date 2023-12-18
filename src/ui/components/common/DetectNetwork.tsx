"use client"
import { APP_ENVIRONMENTS } from '@/config'
import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { goerli, mainnet } from '@wagmi/chains'

const DetectNetwork: React.FC = () => {
  const supportedChain = APP_ENVIRONMENTS.IS_PRODUCTION ? mainnet : goerli
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [classes, setClasses] = useState('hidden')

  useEffect(() => {
    if (isConnected && chain?.id !== supportedChain.id) {
      setClasses('')
    } else {
      setClasses('hidden')
    }
  }, [chain, isConnected])

  const handleSwitchNetwork = async () => {
    await switchNetwork?.(supportedChain.id)
  }

  return (
    <div className={`${classes}`}>
      <div className='detect-network px-4 py-2 w-full text-white z-50 bg-orange-400'>
        <div className='container mx-auto'>
          <span>Network unsupported. Please switch to&nbsp;</span>
          <span
            className='underline cursor-pointer text-black'
            onClick={handleSwitchNetwork}
          >
            {supportedChain.name} network
          </span>
          &nbsp; <span>and continue.</span>
        </div>
      </div>
    </div>
  )
}

export default DetectNetwork
