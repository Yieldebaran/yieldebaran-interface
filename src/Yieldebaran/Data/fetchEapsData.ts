import {Call, Contract, Provider} from 'ethcall'
import {AppState, ApyData, EapData} from "../../Classes/AppState";
import {Network} from "../../networks";
import {ethers} from "ethers";
import Logos from "../../logos";
import {formatBN} from "../../Utils/numbers";

export const ONE = 10n ** 18n

const abi = [
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"calculateExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"exchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"complexityWithdrawalFeeFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"reserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"requestTimeLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getBlockTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"reserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"fulfillmentIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"withdrawTool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"underlying","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAllocations","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"requestIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"requestTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"sharesRequested","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"underlyingRequested","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"stateMutability":"view","type":"function"},
]

export const formatter = (decimals: number, roundTo = decimals) => {
  return (bn: bigint) => {
    if (roundTo === decimals) {
      return formatBN(bn, decimals)
    }
    return String(Number(bn / 10n ** BigInt(decimals - roundTo)) / 10 ** roundTo)
  }
}
const confValF = formatter(16, 3)

const YEAR = 365n * 24n * 3600n
export async function getEapStates(ethcallProvider: Provider, network: Network, apyTimePoints: number[], account: string, blockNumber?: number): Promise<AppState> {
  const timestampContract = new Contract(network.timestampContract, abi);
  const blockNumberContract = new Contract(network.blockNumberContract, abi);
  const usdc = network.usdc
  const eapCalls: Call[] = []
  const secondBatchCall: Call[] = []
  const eaps = network.eaps

  const wToolCalls: Call[] = []
  const underlyingCalls: Call[] = []
  const allocationCalls: Call[] = []

  const exchangeRateCalls: Call[] = []

  eaps.forEach(x => {
    const eapContract = new Contract(x, abi);
    eapCalls.push(eapContract.decimals())
    eapCalls.push(eapContract.calculateExchangeRate())
    exchangeRateCalls.push(eapContract.calculateExchangeRate())
    secondBatchCall.push(eapContract.calculateExchangeRate())
    eapCalls.push(eapContract.totalSupply())
    eapCalls.push(eapContract.balanceOf(account))
    eapCalls.push(eapContract.reserves())
    eapCalls.push(eapContract.complexityWithdrawalFeeFactor())
    eapCalls.push(eapContract.reserveFactor())
    wToolCalls.push(eapContract.withdrawTool())
    underlyingCalls.push(eapContract.underlying())
    allocationCalls.push(eapContract.getAllocations())
  })

  eapCalls.push(
    timestampContract.getBlockTimestamp(),
    ...wToolCalls,
    ...underlyingCalls,
    ...allocationCalls,
    ethcallProvider.getEthBalance(account),
    blockNumberContract.getBlockNumber()
  )

  secondBatchCall.push(timestampContract.getBlockTimestamp())

  const data = await ethcallProvider.all(eapCalls, blockNumber ? blockNumber : 'latest')
  console.log('first query result', data)
  blockNumber = Number(data.pop() as string)
  const accountEthBalance = BigInt(data.pop() as string)

  const allocations = eaps.map(() => data.pop()) as string[][]
  const underlyings = eaps.map(() => data.pop()) as string[]
  const withdrawTools = eaps.map(() => data.pop()) as string[]
  const blockTimestamp = Number(data.pop())

  const apyBlockNumbers = await getClosestBlockNumbers(apyTimePoints.slice(1).map(x => blockTimestamp - x), network)
  apyBlockNumbers.unshift(blockNumber - apyTimePoints[0]);

  const secondCallBatchForCurrentBlock = [...exchangeRateCalls] // touch exchange rates
  eaps.forEach((eap, i) => {
    const toolContract = new Contract(withdrawTools[i], abi)
    const underlyingContract = new Contract(underlyings[i], abi)
    secondCallBatchForCurrentBlock.push(
      toolContract.requestTime(account),
      toolContract.fulfillmentIndex(),
      toolContract.requestIndex(account),
      toolContract.sharesRequested(account),
      toolContract.underlyingRequested(account),
      toolContract.requestTimeLimit(),
      underlyingContract.balanceOf(eap),
      underlyingContract.balanceOf(account),
      underlyingContract.allowance(account, eap),
      underlyingContract.symbol(),
    )
    if (BigInt(underlyings[i]) !== BigInt(usdc)) {
      const pair = new Contract(getPairAddress(underlyings[i], usdc), abi)
      secondCallBatchForCurrentBlock.push(pair.getReserves())
    }
    allocations[i].forEach(alloc => {
      const sharesContract = new Contract(alloc, abi)
      secondCallBatchForCurrentBlock.push(
        sharesContract.balanceOf(eap),
        underlyingContract.balanceOf(alloc),
        sharesContract.exchangeRate(),
      )
    })
  })

  const secondCallResult = await Promise.all([
    ...apyBlockNumbers.map(x => ethcallProvider.all(secondBatchCall, x)),
    ethcallProvider.all(secondCallBatchForCurrentBlock, blockNumber),
  ])

  const secondDataBatchCurrentBlock = secondCallResult.pop() as any[]
  exchangeRateCalls.map(() => secondDataBatchCurrentBlock.shift())

  const periods = secondCallResult.map(x => blockTimestamp - Number(x.pop()))

  const states: { [eapAddress: string]: EapData} = {}

  let secondDataCursor = 0
  let dataCursor = 0
  eaps.forEach((eap, i) => {
    const decimals = Number(data[dataCursor++] as string)

    const format = formatter(decimals)

    const exchangeRate = BigInt(data[dataCursor++] as string)
    const totalSupply = BigInt(data[dataCursor++] as string).toFVal(format)
    const accountShares = BigInt(data[dataCursor++] as string).toFVal(format)
    const reserves = BigInt(data[dataCursor++] as string).toFVal(format)
    const complexityWithdrawalFeeFactor = BigInt(data[dataCursor++] as string).toFVal(confValF)
    const reserveFactor = BigInt(data[dataCursor++] as string).toFVal(confValF)
    const accountRequestTime = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string)
    const lastFulfillmentIndex = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string)
    const accountRequestIndex = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string)
    const accountSharesRequested = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
    const accountUnderlyingRequested = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
    const requestTimeLimit = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string)
    const underlyingUnallocated = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
    const accountUnderlyingBalance = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
    const accountAllowance = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
    const underlyingSymbol =secondDataBatchCurrentBlock[secondDataCursor++] as string

    let underlyingUsdPrice

    if (BigInt(underlyings[i]) !== BigInt(usdc)) {
      const reserve0 = BigInt((secondDataBatchCurrentBlock[secondDataCursor] as any)._reserve0 as string)
      const reserve1 = BigInt((secondDataBatchCurrentBlock[secondDataCursor++] as any)._reserve1 as string)
      let reserveUsdc
      let reserveUnderlying
      if (BigInt(underlyings[i]) > BigInt(usdc)) {
        [reserveUsdc, reserveUnderlying] = [reserve0, reserve1]
      } else {
        [reserveUsdc, reserveUnderlying] = [reserve1, reserve0]
      }
      underlyingUsdPrice = Number(reserveUsdc * 10n ** BigInt(decimals - 3) / reserveUnderlying) / 1e3
    } else {
      underlyingUsdPrice = 1
    }

    const totalUnderlyingBalance = (totalSupply.native * exchangeRate / ONE + reserves.native).toFVal(format)

    let totalWithdrawable = 0n
    const allocationProps = []
    allocations[i].forEach(alloc => {
      const sharesBalance = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(formatter(18))
      const underlyingAvailable = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string).toFVal(format)
      const exchangeRate = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string)
      const underlyingAllocated = (sharesBalance.native * exchangeRate / ONE).toFVal(format)
      const underlyingWithdrawable = underlyingAvailable.native > underlyingAllocated.native ? underlyingAllocated : underlyingAvailable;
      const fullyAvailable = underlyingAllocated === underlyingWithdrawable
      const allocationPercent = Math.round(Number(underlyingAllocated.formatted) * 10000 / Number(totalUnderlyingBalance.formatted)) / 100
      allocationProps.push({
        address: alloc,
        exchangeRate,
        sharesBalance,
        underlyingAvailable,
        underlyingAllocated,
        underlyingWithdrawable,
        fullyAvailable,
        allocationPercent
      })
      totalWithdrawable += underlyingWithdrawable.native
    })

    allocationProps.push({
      address: 'unallocated',
      exchangeRate: ONE,
      sharesBalance: (0n).toFVal(formatter(18)),
      underlyingAvailable: underlyingUnallocated,
      underlyingAllocated: underlyingUnallocated,
      underlyingWithdrawable: underlyingUnallocated,
      fullyAvailable: true,
      allocationPercent: Math.round(Number(underlyingUnallocated.formatted) * 10000 / Number(totalUnderlyingBalance.formatted)) / 100,
    })
    totalWithdrawable += underlyingUnallocated.native

    const apyAfterFee: ApyData[] = []
    periods.forEach((period, periodIdx) => {
      const pastER = BigInt(secondCallResult[periodIdx][i] as string)
      const apy = Number((exchangeRate - pastER) * ONE * YEAR / pastER / BigInt(period) / 10n ** 13n) / 1000
      apyAfterFee.push({
        apy,
        period,
      })
    })

    const accountAllocated = (accountShares.native * exchangeRate / ONE).toFVal(format)
    states[eap] = {
      address: eap,
      isEth: BigInt(underlyings[i]) === BigInt(network.weth),
      exchangeRate,
      underlyingWithdrawable: totalWithdrawable.toFVal(format),
      sharesWithdrawable: (totalWithdrawable * ONE / exchangeRate).toFVal(format),
      totalUnderlyingBalance,
      apyAfterFee,
      lastFulfillmentIndex,
      underlyingUnallocated,
      decimals,
      underlyingLogo: Logos[underlyingSymbol],
      underlyingSymbol,
      underlyingUsdPrice,
      instantWithdrawalFee: complexityWithdrawalFeeFactor,
      performanceFee: reserveFactor,
      reserves,
      underlying: underlyings[i],
      TVL_USD: Math.round(underlyingUsdPrice * Number(totalUnderlyingBalance.formatted) * 100) / 100,
      accountAllocatedUSD: Math.round(underlyingUsdPrice * Number(accountAllocated.formatted) * 100) / 100,
      accountAllowance,
      accountUnderlyingBalance,
      accountShares,
      accountAllocated: (accountShares.native * exchangeRate / ONE).toFVal(format),
      accountRequestTime,
      accountRequestIndex,
      accountSharesRequested,
      accountUnderlyingRequested,
      requestTimeLimit,
      withdrawTool: withdrawTools[i],
      allocations: allocationProps,
    }
  })
  // console.log(states)
  return {
    states,
    accountEthBalance: accountEthBalance.toFVal(formatter(18)),
    blockNumber,
    blockTimestamp,
  }
}

async function getClosestBlockNumbers(timestamps: number[], network: Network): Promise<Array<number>> {
  const { etherscanApiUrl, etherscanApiKey, inception } = network
  return await Promise.all(
      timestamps.map((x) => findClosestBlock(x, etherscanApiUrl, etherscanApiKey, inception))
  )
}

async function findClosestBlock(timestamp: number, baseUrl: string, apiKey: string, inception: number): Promise<number> {
  const url = `${baseUrl}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
  const data = await (await fetch(url)).json();
  console.log('etherscan response')
  console.log(data)
  const res = Number(data.result)
  return inception > res ? inception : res
}

export function getPairAddress(tokenA: string, tokenB: string, isStable?: boolean) {
  // spookyswap setting
  const codeHash = '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2'
  const factory = '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3'
  return getPair(tokenA, tokenB, codeHash, factory, isStable)
}

export function getPair(tokenA: string, tokenB: string, codeHash: string, factory: string, isStable?: boolean) {
  const [token0, token1] = BigInt(tokenA) < BigInt(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  const idTypes = ['address', 'address']
  const idValues: any[] = [token0, token1]
  if (isStable !== undefined) {
    idTypes.push('bool')
    idValues.push(isStable)
  }
  const idHash = ethers.utils.solidityKeccak256(idTypes, idValues)
  return ethers.utils.getAddress(`0x${ethers.utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', factory, idHash, codeHash]).substring(26)}`)
}
