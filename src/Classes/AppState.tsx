import { Provider } from 'ethcall'
import { Network } from '../networks'
import {ethers} from "ethers";
import {getEapStates} from "../Yieldebaran/Data/fetchEapsData";
import {FVal, zeroAppState} from "../Types/appDataContext";
import eapAbi from "../abi/EAP.json";
import withdrawToolAbi from "../abi/WthdrawTool.json";
import ethAdapterAbi from "../abi/EthAdapter.json";

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
    sharesWithdrawable: FVal
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
    states: { [eap: string]: EapData },
    accountEthBalance: FVal,
    blockNumber: number,
    blockTimestamp: number,
}

export const ethcallProvider = new Provider()

let initializedChainId = 0
let signer: any

export const loadAppState = async (provider: any, network: Network, userAddress?: string, blockNumber?: number): Promise<AppState> => {
    if (initializedChainId !== network.chainId) {
        await ethcallProvider.init(provider as ethers.providers.Provider)
        initializedChainId = network.chainId
    }
    if (!userAddress) {
        userAddress = `0x${randomHex(40)}`
    }

    signer = provider.getSigner()

    if (network.eaps) {
        return getEapStates(ethcallProvider, network, [60, 7 * 24 * 3600], userAddress, blockNumber)
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
    const poolContract = new ethers.Contract(pool, eapAbi, signer)
    return poolContract.deposit(amount)
}

export async function requestWithdrawal(pool: string, address: string, amount: bigint) {
    if (!signer) {
        return
    }
    console.log('requestWithdrawal', pool, address, amount)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(pool, eapAbi, signer)
    return poolContract.requestWithdrawal(amount, address)
}

export async function cancelRequest(withdrawTool: string) {
    if (!signer) {
        return
    }
    console.log('cancelRequest', withdrawTool)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer)
    return poolContract.cancelRequest()
}

export async function claimWithdrawal(withdrawTool: string) {
    if (!signer) {
        return
    }
    console.log('claimWithdrawal', withdrawTool)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer)
    return poolContract.claim()
}

export async function claimWithdrawalEth(withdrawTool: string) {
    if (!signer) {
        return
    }
    console.log('claimWithdrawalEth', withdrawTool)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer)
    return poolContract.claimEth()
}

export async function approve(token: string, spender: string, amount: bigint) {
    console.log('approve', token, spender, amount)
    if (!signer) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokenContract = new ethers.Contract(token, eapAbi, signer)
    return tokenContract.approve(spender, amount)
}

export async function depositEth(ethAdapter: string, amount: bigint) {
    console.log('depositEth', ethAdapter, amount)
    if (!signer) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const adapterContract = new ethers.Contract(ethAdapter, ethAdapterAbi, signer)
    return adapterContract.depositEth({value: amount})
}

export async function instantWithdrawal(pool: string, amount: bigint, minFromBalance: bigint, account: string) {
    console.log('instantWithdrawal', pool, amount, minFromBalance, account)
    if (!signer) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(pool, eapAbi, signer)
    return poolContract.instantWithdrawal(amount, minFromBalance, account)
}

export async function instantWithdrawalEth(pool: string, amount: bigint, minFromBalance: bigint, account: string) {
    console.log('instantWithdrawal', pool, amount, minFromBalance, account)
    if (!signer) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poolContract = new ethers.Contract(pool, eapAbi, signer)
    return poolContract.instantWithdrawalEth(amount, minFromBalance, account)
}


