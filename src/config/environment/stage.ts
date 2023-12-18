import { goerli } from "@wagmi/chains";

const STAGE_ENV = {
  IS_PRODUCTION: false,
  GENESIS_MINT_CONTRACT_ADDRESS: "0x88d0fD2860096ebc887F551DbFb65d40Ea419309",
  API_ROOT_URL: "https://services-stage.pellar.io/api/v1/mittaria",
  INFURA_KEY: "",
  ACTIVE_CHAIN: goerli,
  GA_MEASUREMENT_ID: 'G-P8ED1WMW69',
  RPC_URL_BACKUP: 'https://rpc.ankr.com/eth_goerli/'
};

export default STAGE_ENV;
