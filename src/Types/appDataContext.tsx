import { createContext, useContext } from 'react';

import { EapData } from '../Classes/AppState';
import { formatter } from '../Yieldebaran/Data/fetchEapsData';

export type FVal = {
  readonly native: bigint;
  readonly formatted: string;
};

declare global {
  interface BigInt {
    toFVal(format: (bn: bigint) => string): FVal;
  }
}

BigInt.prototype.toFVal = function formatter(format: (bn: bigint) => string): FVal {
  return {
    native: BigInt(this as bigint),
    formatted: format(this as bigint),
  };
};

export type AppDataContext = {
  blockTimestamp: number;
  blockNumber: number;
  eapStates: { [eap: string]: EapData };
  accountEthBalance: FVal;
  updateAppState: (blockNumber?: number) => Promise<void>;
  selectedPool: string | undefined;
  setSelectedPool: (m: string | undefined) => void;
};

export const zeroAppState = {
  accountEthBalance: 0n.toFVal(formatter(18)),
  blockNumber: 0,
  blockTimestamp: 0,
  states: {},
};

export const YieldebaranDataContext = createContext<AppDataContext>({
  blockTimestamp: 0,
  blockNumber: 0,
  eapStates: {},
  accountEthBalance: { native: 0n, formatted: '0.0' },
  updateAppState: async () => undefined,
  selectedPool: undefined,
  setSelectedPool: () => undefined,
});

export const useYieldebaranDataContext = (): AppDataContext => useContext(YieldebaranDataContext);
