import { Call, Contract, Provider } from 'ethcall';

import { ethers } from 'ethers';

import { AppState, ApyData, EapData } from 'src/classes/AppState';
import { ChainConfig } from 'src/constants/chain';
import { formatBN } from 'src/utils/numbers';

import Logos from '../../logos';

import multiAbi from './multiiAbi';

export const ONE = 10n ** 18n;

export const formatter = (decimals: number, roundTo = decimals) => {
  return (bn: bigint) => {
    if (roundTo === decimals) {
      return formatBN(bn, decimals);
    }
    return String(Number(bn / 10n ** BigInt(decimals - roundTo)) / 10 ** roundTo);
  };
};

const confValF = formatter(16, 3);

const YEAR = 365n * 24n * 3600n;
export async function getEapStates(
  ethcallProvider: Provider,
  network: ChainConfig,
  apyTimePoints: number[],
  account: string,
  blockNumber?: number,
): Promise<AppState> {
  const timestampContract = new Contract(network.timestampContract, multiAbi);
  const blockNumberContract = new Contract(network.blockNumberContract, multiAbi);
  const usdc = network.usdc;
  const eapCalls: Call[] = [];
  const secondBatchCall: Call[] = [];
  const eaps = network.eaps;

  const wToolCalls: Call[] = [];
  const underlyingCalls: Call[] = [];
  const allocationCalls: Call[] = [];

  const exchangeRateCalls: Call[] = [];

  eaps.forEach((x) => {
    const eapContract = new Contract(x, multiAbi);
    eapCalls.push(eapContract.decimals());
    eapCalls.push(eapContract.calculateExchangeRate());
    exchangeRateCalls.push(eapContract.calculateExchangeRate());
    secondBatchCall.push(eapContract.calculateExchangeRate());
    eapCalls.push(eapContract.totalSupply());
    eapCalls.push(eapContract.balanceOf(account));
    eapCalls.push(eapContract.reserves());
    eapCalls.push(eapContract.complexityWithdrawalFeeFactor());
    eapCalls.push(eapContract.reserveFactor());
    wToolCalls.push(eapContract.withdrawTool());
    underlyingCalls.push(eapContract.underlying());
    allocationCalls.push(eapContract.getAllocations());
  });

  eapCalls.push(
    timestampContract.getBlockTimestamp(),
    ...wToolCalls,
    ...underlyingCalls,
    ...allocationCalls,
    ethcallProvider.getEthBalance(account),
    blockNumberContract.getBlockNumber(),
  );

  // console.log('calling block n', blockNumber ? blockNumber : 'latest')
  const data = await ethcallProvider.all(eapCalls, blockNumber ? blockNumber : 'latest');
  // console.log('first query result', data)
  blockNumber = Number(data.pop() as string);
  // console.log({ blockNumber })
  const accountEthBalance = BigInt(data.pop() as string);

  const allocations = eaps.map(() => data.pop()) as string[][];
  const underlyings = eaps.map(() => data.pop()) as string[];
  const withdrawTools = eaps.map(() => data.pop()) as string[];
  const blockTimestamp = Number(data.pop());

  const apyBlockNumbers = await getClosestBlockNumbers(
    apyTimePoints.slice(1).map((x) => blockTimestamp - x),
    network,
  );

  // period for current `apy` doesn't matter
  apyBlockNumbers.unshift(blockNumber - apyTimePoints[0]);

  const secondCallBatchForCurrentBlock = [...exchangeRateCalls]; // touch exchange rates
  eaps.forEach((eap, i) => {
    const eapContract = new Contract(eap, multiAbi);
    const toolContract = new Contract(withdrawTools[i], multiAbi);
    const underlyingContract = new Contract(underlyings[i], multiAbi);
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
    );
    if (BigInt(underlyings[i]) !== BigInt(usdc)) {
      const pair = new Contract(getPairAddress(underlyings[i], usdc, network), multiAbi);
      secondCallBatchForCurrentBlock.push(pair.getReserves());
    }
    allocations[i].forEach((alloc) => {
      const sharesContract = new Contract(alloc, multiAbi);
      secondCallBatchForCurrentBlock.push(
        sharesContract.balanceOf(eap),
        underlyingContract.balanceOf(alloc),
        sharesContract.exchangeRate(),
        eapContract.platformAdapter(alloc),
      );
      secondBatchCall.push(sharesContract.exchangeRate());
    });
  });

  secondBatchCall.push(timestampContract.getBlockTimestamp());

  // console.log({apyBlockNumbers})

  const secondCallResults = await Promise.all([
    ...apyBlockNumbers.map((x) => ethcallProvider.all(secondBatchCall, x)),
    ethcallProvider.all(secondCallBatchForCurrentBlock, blockNumber),
  ]);
  // console.log('second query result', secondCallResults)

  const secondDataBatchCurrentBlock = secondCallResults.pop() as any[];
  exchangeRateCalls.map(() => secondDataBatchCurrentBlock.shift());

  const periods = secondCallResults.map((x) => blockTimestamp - Number(x.pop()));

  const states: { [eapAddress: string]: EapData } = {};

  let secondDataCursor = 0;
  let dataCursor = 0;
  eaps.forEach((eap, i) => {
    const decimals = Number(data[dataCursor++] as string);

    const format = formatter(decimals);

    const exchangeRate = BigInt(data[dataCursor++] as string);
    const totalSupply = BigInt(data[dataCursor++] as string).toFVal(format);
    const accountShares = BigInt(data[dataCursor++] as string).toFVal(format);
    const reserves = BigInt(data[dataCursor++] as string).toFVal(format);
    const complexityWithdrawalFeeFactor = BigInt(data[dataCursor++] as string).toFVal(confValF);
    const reserveFactor = BigInt(data[dataCursor++] as string).toFVal(confValF);
    const accountRequestTime = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string);
    const lastFulfillmentIndex = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string);
    const accountRequestIndex = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string);
    const accountSharesRequested = BigInt(
      secondDataBatchCurrentBlock[secondDataCursor++] as string,
    ).toFVal(format);
    const accountUnderlyingRequested = BigInt(
      secondDataBatchCurrentBlock[secondDataCursor++] as string,
    ).toFVal(format);
    const requestTimeLimit = Number(secondDataBatchCurrentBlock[secondDataCursor++] as string);
    const underlyingUnallocated = BigInt(
      secondDataBatchCurrentBlock[secondDataCursor++] as string,
    ).toFVal(format);
    const accountUnderlyingBalance = BigInt(
      secondDataBatchCurrentBlock[secondDataCursor++] as string,
    ).toFVal(format);
    const accountAllowance = BigInt(
      secondDataBatchCurrentBlock[secondDataCursor++] as string,
    ).toFVal(format);
    const underlyingSymbol = secondDataBatchCurrentBlock[secondDataCursor++] as string;

    let underlyingUsdPrice;

    if (BigInt(underlyings[i]) !== BigInt(usdc)) {
      const reserve0 = BigInt(
        (secondDataBatchCurrentBlock[secondDataCursor] as any)._reserve0 as string,
      );
      const reserve1 = BigInt(
        (secondDataBatchCurrentBlock[secondDataCursor++] as any)._reserve1 as string,
      );
      let reserveUsdc;
      let reserveUnderlying;
      if (BigInt(underlyings[i]) > BigInt(usdc)) {
        [reserveUsdc, reserveUnderlying] = [reserve0, reserve1];
      } else {
        [reserveUsdc, reserveUnderlying] = [reserve1, reserve0];
      }
      underlyingUsdPrice =
        Number((reserveUsdc * 10n ** BigInt(decimals - 3)) / reserveUnderlying) / 1e3;
    } else {
      underlyingUsdPrice = 1;
    }

    const totalUnderlyingBalance = (
      (totalSupply.native * exchangeRate) / ONE +
      reserves.native
    ).toFVal(format);

    const apyAfterFee: ApyData[] = [];
    periods.forEach((period, periodIdx) => {
      const pastER = BigInt(secondCallResults[periodIdx][i] as string);
      const apy = exchangeRate <= pastER ? 0 :
        Number(((exchangeRate - pastER) * ONE * YEAR) / pastER / BigInt(period) / 10n ** 13n) /
        1000;
      apyAfterFee.push({ apy, period });
    });

    let totalWithdrawable = 0n;
    const allocationProps = [];
    allocations[i].forEach((alloc, allocIndex) => {
      const sharesBalance = BigInt(
        secondDataBatchCurrentBlock[secondDataCursor++] as string,
      ).toFVal(formatter(18));
      const underlyingAvailable = BigInt(
        secondDataBatchCurrentBlock[secondDataCursor++] as string,
      ).toFVal(format);
      const exchangeRate = BigInt(secondDataBatchCurrentBlock[secondDataCursor++] as string);
      const platformAdapter = secondDataBatchCurrentBlock[secondDataCursor++] as string;
      const allocationName: string =
        (network.adapters[platformAdapter] || 'unknown platform') + ' ' + underlyingSymbol;
      const underlyingAllocated = ((sharesBalance.native * exchangeRate) / ONE).toFVal(format);
      const underlyingWithdrawable =
        underlyingAvailable.native > underlyingAllocated.native
          ? underlyingAllocated
          : underlyingAvailable;
      const fullyAvailable = underlyingAllocated === underlyingWithdrawable;
      const allocationPercent =
        Math.round(
          (Number(underlyingAllocated.formatted) * 10000) /
            Number(totalUnderlyingBalance.formatted),
        ) / 100;
      if (allocationPercent === 0) return;

      const pastER = BigInt(secondCallResults[0][eaps.length + allocIndex] as string);
      const apy = exchangeRate <= pastER ? 0 :
        Number(((exchangeRate - pastER) * ONE * YEAR) / pastER / BigInt(periods[0]) / 10n ** 13n) /
        1000;
      const currentApy = { apy, period: periods[0] };

      allocationProps.push({
        address: alloc,
        exchangeRate,
        sharesBalance,
        underlyingAvailable,
        underlyingAllocated,
        underlyingWithdrawable,
        fullyAvailable,
        allocationPercent,
        allocationName,
        currentApy,
      });
      totalWithdrawable += underlyingWithdrawable.native;
    });

    if (underlyingUnallocated.native !== 0n) {
      allocationProps.push({
        address: 'unallocated',
        exchangeRate: ONE,
        sharesBalance: 0n.toFVal(formatter(18)),
        underlyingAvailable: underlyingUnallocated,
        underlyingAllocated: underlyingUnallocated,
        underlyingWithdrawable: underlyingUnallocated,
        fullyAvailable: true,
        allocationPercent:
          Math.round(
            (Number(underlyingUnallocated.formatted) * 10000) /
              Number(totalUnderlyingBalance.formatted),
          ) / 100,
        allocationName: 'unallocated',
        currentApy: { apy: 0, period: 0 },
      });
    }

    allocationProps.sort((a, b) => b.allocationPercent - a.allocationPercent);
    totalWithdrawable += underlyingUnallocated.native;

    // console.log(Logos[underlyingSymbol])

    const accountAllocated = ((accountShares.native * exchangeRate) / ONE).toFVal(format);
    states[eap] = {
      address: eap,
      isEth: BigInt(underlyings[i]) === BigInt(network.weth),
      exchangeRate,
      underlyingWithdrawable: totalWithdrawable.toFVal(format),
      sharesWithdrawable: ((totalWithdrawable * ONE) / exchangeRate).toFVal(format),
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
      TVL_USD:
        Math.round(underlyingUsdPrice * Number(totalUnderlyingBalance.formatted) * 100) / 100,
      accountAllocatedUSD:
        Math.round(underlyingUsdPrice * Number(accountAllocated.formatted) * 100) / 100,
      accountAllowance,
      accountUnderlyingBalance,
      accountShares,
      accountAllocated: ((accountShares.native * exchangeRate) / ONE).toFVal(format),
      accountRequestTime,
      accountRequestIndex,
      accountSharesRequested,
      accountUnderlyingRequested,
      requestTimeLimit,
      withdrawTool: withdrawTools[i],
      allocations: allocationProps,
    };
  });
  // console.log(states)
  return {
    states,
    accountEthBalance: accountEthBalance.toFVal(formatter(18)),
    blockNumber,
    blockTimestamp,
  };
}

async function getClosestBlockNumbers(
  timestamps: number[],
  network: ChainConfig,
): Promise<Array<number>> {
  const { etherscanApiUrl, etherscanApiKey, inception } = network;
  return await Promise.all(
    timestamps.map((x) => findClosestBlock(x, etherscanApiUrl, inception, etherscanApiKey)),
  );
}

async function findClosestBlock(
  timestamp: number,
  baseUrl: string,
  inception: number,
  apiKey?: string,
): Promise<number> {
  const url = `${baseUrl}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before` + (apiKey ? `&apikey=${apiKey}` : '');
  const data = await (await fetch(url)).json();
  const res = Number(typeof data.result === 'object' ? data.result.blockNumber : data.result);
  return inception > res ? inception : res;
}

export function getPairAddress(tokenA: string, tokenB: string, network: ChainConfig) {
  // spookyswap setting
  const { codeHash, factory, isSolidly } = network.liquiditySource;
  return getPair(tokenA, tokenB, codeHash, factory, isSolidly ? false : undefined);
}

export function getPair(
  tokenA: string,
  tokenB: string,
  codeHash: string,
  factory: string,
  isStable?: boolean,
) {
  const [token0, token1] = BigInt(tokenA) < BigInt(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
  const idTypes = ['address', 'address'];
  const idValues: any[] = [token0, token1];
  if (isStable !== undefined) {
    idTypes.push('bool');
    idValues.push(isStable);
  }
  const idHash = ethers.utils.solidityKeccak256(idTypes, idValues);
  return ethers.utils.getAddress(
    `0x${ethers.utils
      .solidityKeccak256(
        ['bytes1', 'address', 'bytes32', 'bytes32'],
        ['0xff', factory, idHash, codeHash],
      )
      .substring(26)}`,
  );
}
