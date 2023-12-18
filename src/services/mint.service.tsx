import React, { useEffect, useState } from 'react'
import { APP_ENVIRONMENTS } from '@/config'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'
import { GENESIS_MINT_ABI } from '@/lib/abi/genesisMint'
import { filter, find, forEach, isEmpty, map, size } from 'lodash'
import moment from 'moment'
import { zeroAddress } from 'viem'

const { API_ROOT_URL } = APP_ENVIRONMENTS

const MintService = () => {
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { chain } = useNetwork()

  const [phaseInfo, setPhaseInfo] = useState<any>({})
  const [phaseInfoNext, setPhaseInfoNext] = useState<any>({})
  const [whitelist, setWhitelist] = useState<any>({})

  const configContract = {
    address: APP_ENVIRONMENTS.GENESIS_MINT_CONTRACT_ADDRESS as any,
    abi: GENESIS_MINT_ABI,
    watch: true
  }

  const { data: accountBalance } = useBalance({
    address: address,
    chainId: chain?.id,
  })

  const phaseId1 = useContractRead({
    ...configContract,
    functionName: 'getPhaseInfo',
    args: [BigInt(1)]
  })
  const phaseId2 = useContractRead({
    ...configContract,
    functionName: 'getPhaseInfo',
    args: [BigInt(2)]
  })
  const phaseId3 = useContractRead({
    ...configContract,
    functionName: 'getPhaseInfo',
    args: [BigInt(3)]
  })

  const phaseId4 = useContractRead({
    ...configContract,
    functionName: 'getPhaseInfo',
    args: [BigInt(4)]
  })
  // TODO: add phaseId5 when prep deployContract
  // const phaseId5 = useContractRead({
  //   ...configContract,
  //   functionName: 'getPhaseInfo',
  //   args: [BigInt(5)]
  // })

  useEffect(() => {
    const currentUtcUnixTime = moment.utc().unix()
    const phases = [phaseId1, phaseId2, phaseId3, phaseId4]
    const data = map(phases, (phase, index) => {
      if (!phase?.data) return undefined
      return {
        ...phase.data,
        id: index + 1
      }
    })

    // exclude phase 2 as it's private team mint
    const phaseDataFilter = filter(data, (phase) => phase !== undefined && phase.id !== 2)

    if (!size(phaseDataFilter)) return

    const findActive = find(phaseDataFilter, (phase) => {
      const startTime = phase?.[0]?.startTime
      const endTime = phase?.[0]?.endTime
      return currentUtcUnixTime >= startTime! && currentUtcUnixTime <= endTime!
    })
    const phaseData = {
      phaseId: findActive?.id,
      detail: findActive?.[0],
      version: findActive?.[1],
      phaseTotalMinted: findActive?.[2],
      isActive: !isEmpty(findActive)
    }
    setPhaseInfo(phaseData)

    const findNextPhase = find(phaseDataFilter, (phase) => {
      const startTime = phase?.[0]?.startTime
      return currentUtcUnixTime < startTime!
    })
    const nextPhaseData = {
      phaseId: findNextPhase?.id,
      detail: findNextPhase?.[0],
      version: findNextPhase?.[1]
    }
    setPhaseInfoNext(nextPhaseData)
  }, [phaseId1.data, phaseId2.data, phaseId3.data, phaseId4.data])

  useEffect(() => {
    if (isEmpty(phaseInfo) || !phaseInfo?.isActive || !address) return
    fetchWhitelist()
  }, [phaseInfo, address])

  const fetchWhitelist = async () => {
    const phaseId = phaseInfo?.phaseId
    const version = phaseInfo?.version
    const url = `${API_ROOT_URL}/users/genesis/whitelists/phases/${phaseId}/versions/${version}/account/${address}?time=${Date.now()}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      setWhitelist(data)
    } catch (error) {
      console.log(error)
    }
  }

  const { data: tokenMintedByAccount } = useContractRead({
    ...configContract,
    functionName: 'getTokenMintedByAccount',
    args: [phaseInfo?.phaseId || 0, address || zeroAddress],
    watch: true
  })

  const { data: totalSupply } = useContractRead({
    ...configContract,
    functionName: 'maxSupply'
  })

  const { data: soldNumber, refetch: refetchSoldNumber } = useContractRead({
    ...configContract,
    functionName: 'currentIdx',
    watch: true
  })

  return {
    configContract,
    phaseInfo,
    phaseInfoNext,
    tokenMintedByAccount,
    totalSupply,
    soldNumber: soldNumber! - 1,
    refetchSoldNumber,
    whitelist,
    accountBalance
  }
}

export default MintService
