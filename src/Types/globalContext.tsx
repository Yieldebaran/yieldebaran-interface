import { createContext, useContext } from "react";
import { Network } from "../networks";

export type GlobalContext = {
    network: Network | null,
    setNetwork: (n: Network | null) => void,
    address: string,
    setAddress: (a: string) => void
}

export const MyGlobalContext = createContext<GlobalContext>({
    network: null,
    setNetwork: () => undefined,
    address: "",
    setAddress: () => undefined,
})

export const useGlobalContext = () : GlobalContext => useContext(MyGlobalContext)