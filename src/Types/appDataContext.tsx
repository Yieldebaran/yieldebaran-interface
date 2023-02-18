import { createContext, useContext } from "react";
import {AppState, EapData} from "../Classes/AppState";
import {formatter} from "../Yieldebaran/Data/fetchEapsData";

export type FVal = {
    readonly native: bigint,
    readonly formatted: string,
}

declare global {
    interface BigInt {
        toFVal(format: (bn: bigint) => string): FVal;
    }
}

BigInt.prototype.toFVal = function formatter(format: (bn: bigint) => string): FVal {
    return {
        native: BigInt(this as bigint),
        formatted: format(this as bigint),
    }
}

export type AppDataContext = {
    appState: AppState,
    updateAppState: () => Promise<void>,
    selectedPool: EapData | undefined,
    setSelectedPool: (m: EapData | undefined) => void
}

export const zeroAppState = {
    accountEthBalance: 0n.toFVal(formatter(18)),
    blockNumber: 0,
    blockTimestamp: 0,
    states: [],
  provider: null,
}

export const YieldebaranDataContext = createContext<AppDataContext>({
    appState: zeroAppState,
    updateAppState: async () => undefined,
    selectedPool: undefined,
    setSelectedPool: () => undefined,
})

export const useYieldebaranDataContext = () : AppDataContext => useContext(YieldebaranDataContext)
