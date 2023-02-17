import { Provider } from 'ethcall'
import { Network } from '../networks'
import {ethers} from "ethers";
import {getEapStates} from "../Hundred/Data/fetchEapsData";
import {FVal, zeroAppState} from "../Types/appDataContext";

export type ApyData = {
    apy: number,
    period: number,
}

export type AllocationData = {
    address: string,
    exchangeRate: bigint,
    sharesBalance: FVal,
    underlyingAvailable: FVal,
    underlyingAllocated: FVal,
    underlyingWithdrawable: FVal,
    fullyAvailable: boolean,
    allocationPercent: number,
}

export type EapData = {
    address: string
    withdrawTool: string
    isEth: boolean
    apyAfterFee: ApyData[]
    exchangeRate: bigint
    underlyingWithdrawable: FVal
    totalUnderlyingBalance: FVal
    totalUnderlyingRequested: FVal
    underlyingUnallocated: FVal
    lastFulfillmentIndex: number
    accountRequestIndex: number
    decimals: number
    underlyingSymbol: string
    underlying: string
    underlyingLogo: string
    underlyingUsdPrice: number
    TVL_USD: number
    instantWithdrawalFee: FVal
    performanceFee: FVal
    reserves: FVal
    accountAllowance: FVal
    accountUnderlyingBalance: FVal
    accountShares: FVal
    accountAllocated: FVal
    accountSharesRequested: FVal
    accountUnderlyingRequested: FVal
    allocations: AllocationData[]
}

export type AppState = {
    states: EapData[],
    accountEthBalance: FVal,
    blockNumber: number,
    blockTimestamp: number,
}

export const ethcallProvider = new Provider()

let initializedChainId = 0
let signer: any

export const loadAppState = async (provider: any, network: Network, userAddress?: string): Promise<AppState> => {
    if (initializedChainId !== network.chainId) {
        await ethcallProvider.init(provider as ethers.providers.Provider)
        initializedChainId = network.chainId
    }
    if (!userAddress) {
        userAddress = `0x${randomHex(40)}`
    }

    signer = provider.getSigner()

    if (network.eaps) {
        return getEapStates(ethcallProvider, network, [60, 24 * 3600], userAddress)
    }

    return zeroAppState
}

function randomHex(size: number) {
    return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
}


export async function deposit(pool: string, amount: bigint) {
    console.log('deposit', pool, amount)
    if (!signer) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // const poolContract = new ethers.Contract(pool, eapAbi, signer)

}


