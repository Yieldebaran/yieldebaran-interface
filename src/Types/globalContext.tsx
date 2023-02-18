import { createContext, useContext } from "react";
import { Network } from "../networks";
import {ethers} from "ethers";

export type GlobalContext = {
    network: Network | null,
    setNetwork: (n: Network | null) => void,
    webSocketProvider: ethers.providers.WebSocketProvider | undefined,
    setWebSocketProvider: (p: ethers.providers.WebSocketProvider) => void,
    address: string,
    setAddress: (a: string) => void
}

export const MyGlobalContext = createContext<GlobalContext>({
    network: null,
    setNetwork: () => undefined,
    webSocketProvider: undefined,
    setWebSocketProvider: () => undefined,
    address: "",
    setAddress: () => undefined,
})

export const useGlobalContext = () : GlobalContext => useContext(MyGlobalContext)