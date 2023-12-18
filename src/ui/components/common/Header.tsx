"use client"
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { truncateAddress } from '@/helpers'
import { IconChevronDown, IconLogout } from '@tabler/icons-react'
import { MintService } from '@/services'

const Header: React.FC = () => {
  const { accountBalance, tokenMintedByAccount, whitelist } = MintService()
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <div className='header px-4 absolute top-0 left-0 w-full text-white z-20'>
      <div className='container mx-auto py-4 flex flex-row justify-end'>
        {address && activeConnector && isConnected ? (
          <div className='group'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-48'>
              <span className='flex gap-2 items-center justify-center'>
                My Account
                <IconChevronDown size={20} />
              </span>
            </button>

            <div className='z-10 bg-gray-600 divide-y divide-gray-100 rounded-lg shadow w-48 dark:bg-gray-700 hidden group-hover:block'>
              <ul className='py-2 text-sm text-gray-700 dark:text-gray-200 mt-2 font-kanit'>
                <li className='cursor-default text-white font-bold px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white flex flex-row items-center gap-2 whitespace-nowrap'>
                  Address:{' '}
                  <span className='text-white font-medium'>{truncateAddress(address)}</span>
                </li>
                <li className='cursor-default text-white font-bold px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white flex flex-row items-center gap-2 whitespace-nowrap'>
                  Balance:{' '}
                  <span className='text-white font-medium'>
                    {Number(accountBalance?.formatted).toFixed(4)} ETH
                  </span>
                </li>
                <li className='cursor-default text-white font-bold px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white flex flex-row items-center gap-2 whitespace-nowrap'>
                  Allow Mint:{' '}
                  <span className='text-white font-medium'>
                    {Math.max(
                      Number(whitelist?.max_amount) -
                        Number(tokenMintedByAccount),
                      0
                    ) || 0}
                  </span>
                </li>
                <li className='cursor-default text-white font-bold px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white flex flex-row items-center gap-2 whitespace-nowrap'>
                  Total Minted:{' '}
                  <span className='text-white font-medium'>
                    {tokenMintedByAccount || 0}
                  </span>
                </li>
                <li
                  className='text-white font-bold px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white flex flex-row items-center gap-2 cursor-pointer'
                  onClick={() => disconnect()}
                >
                  Disconnect <IconLogout size={14} />
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Header
