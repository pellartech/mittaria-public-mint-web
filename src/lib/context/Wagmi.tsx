'use client'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { APP_ENVIRONMENTS } from '@/config'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const { INFURA_KEY, ACTIVE_CHAIN, RPC_URL_BACKUP } = APP_ENVIRONMENTS

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ACTIVE_CHAIN],
  [
    infuraProvider({ apiKey: INFURA_KEY }),
    jsonRpcProvider({
      rpc: () => ({
        http: RPC_URL_BACKUP
      })
    })
  ],
  {
    pollingInterval: 60000
  }
)

const connectors = [new MetaMaskConnector({ chains })]

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})

export default function _WagmiConfig({
  children
}: {
  children: React.ReactNode
}) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
