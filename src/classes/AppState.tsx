import debug from 'debug';
import { Provider } from 'ethcall';

import { ethers } from 'ethers';

import { ChainConfig } from 'src/constants/chain';

import eapAbi from '../abi/EAP.json';
import ethAdapterAbi from '../abi/EthAdapter.json';
import withdrawToolAbi from '../abi/WthdrawTool.json';
import { FVal, zeroAppState } from '../types/appDataContext';
import { getEapStates } from '../Yieldebaran/Data/fetchEapsData';

const log = debug('store:AppState');

export type ApyData = {
  apy: number;
  period: number;
};

export type AllocationData = {
  address: string;
  exchangeRate: bigint;
  sharesBalance: FVal;
  underlyingAvailable: FVal;
  underlyingAllocated: FVal;
  underlyingWithdrawable: FVal;
  fullyAvailable: boolean;
  allocationPercent: number;
  allocationName: string;
  currentApy: { apy: number; period: number };
};

export type EapData = {
  address: string;
  withdrawTool: string;
  isEth: boolean;
  apyAfterFee: ApyData[];
  exchangeRate: bigint;
  underlyingWithdrawable: FVal;
  sharesWithdrawable: FVal;
  totalUnderlyingBalance: FVal;
  accountRequestTime: number;
  underlyingUnallocated: FVal;
  lastFulfillmentIndex: number;
  accountRequestIndex: number;
  decimals: number;
  underlyingSymbol: string;
  underlying: string;
  underlyingLogo: string;
  underlyingUsdPrice: number;
  TVL_USD: number;
  requestTimeLimit: number;
  instantWithdrawalFee: FVal;
  performanceFee: FVal;
  reserves: FVal;
  accountAllowance: FVal;
  accountUnderlyingBalance: FVal;
  accountShares: FVal;
  accountAllocated: FVal;
  accountSharesRequested: FVal;
  accountAllocatedUSD: number;
  accountUnderlyingRequested: FVal;
  allocations: AllocationData[];
};

export type AppState = {
  states: { [eap: string]: EapData };
  accountEthBalance: FVal;
  blockNumber: number;
  blockTimestamp: number;
};

export const ethcallProvider = new Provider();

let initializedChainId = 0;
let signer: any;

export const loadAppState = async (
  provider: any,
  network: ChainConfig,
  userAddress?: string,
  blockNumber?: number,
): Promise<AppState> => {
  if (initializedChainId !== network.chainId) {
    await ethcallProvider.init(provider as ethers.providers.Provider);
    initializedChainId = network.chainId;
  }
  if (!userAddress) {
    userAddress = `0x${randomHex(40)}`;
  }

  if (network.eaps) {
    return getEapStates(ethcallProvider, network, [60, 7 * 24 * 3600], userAddress, blockNumber);
  }

  return zeroAppState;
};

export const setSigner = (
  provider: any,
) => {
  signer = provider.getSigner();
};

function randomHex(size: number) {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export async function deposit(pool: string, amount: bigint) {
  log('deposit fired', { pool, amount, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(pool, eapAbi, signer);

  return poolContract.deposit(amount);
}

export async function requestWithdrawal(pool: string, amount: bigint, address?: string | null) {
  if (!address) return;
  log('requestWithdrawal fired', { pool, address, amount, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(pool, eapAbi, signer);

  return poolContract.requestWithdrawal(amount, address);
}

export async function cancelRequest(withdrawTool: string) {
  log('cancelRequest fired', { withdrawTool, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer);

  return poolContract.cancelRequest();
}

export async function claimWithdrawal(withdrawTool: string) {
  log('claimWithdrawal fired', { withdrawTool, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer);
  return poolContract.claim();
}

export async function freeInstantWithdrawal(withdrawTool: string) {
  log('freeInstantWithdrawal fired', { withdrawTool, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer);
  return poolContract.instantWithdrawal();
}

export async function freeInstantWithdrawalEth(withdrawTool: string) {
  log('freeInstantWithdrawalEth fired', { withdrawTool, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer);
  return poolContract.instantWithdrawalEth();
}

export async function claimWithdrawalEth(withdrawTool: string) {
  log('claimWithdrawalEth', { withdrawTool, signer });

  if (!signer) return;

  const poolContract = new ethers.Contract(withdrawTool, withdrawToolAbi, signer);
  return poolContract.claimEth();
}

export async function approve(token: string, spender: string, amount: bigint) {
  log('approve fired', { token, spender, amount, signer });
  if (!signer) return;

  const tokenContract = new ethers.Contract(token, eapAbi, signer);
  return tokenContract.approve(spender, amount);
}

export async function depositEth(ethAdapter: string, amount: bigint) {
  log('depositEth fired', { ethAdapter, amount, signer });
  if (!signer) return;

  const adapterContract = new ethers.Contract(ethAdapter, ethAdapterAbi, signer);
  return adapterContract.depositEth({ value: amount });
}

export async function instantWithdrawal(
  pool: string,
  amount: bigint,
  minFromBalance: bigint,
  account: string,
) {
  log('instantWithdrawal fired', { pool, amount, minFromBalance, account, signer });
  if (!signer) return;

  const poolContract = new ethers.Contract(pool, eapAbi, signer);
  return poolContract.instantWithdrawal(amount, minFromBalance, account);
}

export async function instantWithdrawalEth(
  pool: string,
  amount: bigint,
  minFromBalance: bigint,
  account: string,
) {
  log('instantWithdrawal fired', { pool, amount, minFromBalance, account, signer });
  if (!signer) return;

  const poolContract = new ethers.Contract(pool, eapAbi, signer);
  return poolContract.instantWithdrawalEth(amount, minFromBalance, account);
}
