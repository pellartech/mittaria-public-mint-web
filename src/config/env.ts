import { Chain } from 'wagmi'
import PRODUCTION_ENV from './environment/production'
import STAGE_ENV from './environment/stage'

export type Environments = {
  IS_PRODUCTION: boolean
  GENESIS_MINT_CONTRACT_ADDRESS: string
  API_ROOT_URL: string
  INFURA_KEY: string
  ACTIVE_CHAIN: Chain
  GA_MEASUREMENT_ID: string
  RPC_URL_BACKUP: string
}

export const APP_ENVIRONMENTS: Environments = {
  stage: STAGE_ENV,
  production: PRODUCTION_ENV
}[process.env.NEXT_PUBLIC_CONFIG_ENV === 'production' ? 'production' : 'stage']
