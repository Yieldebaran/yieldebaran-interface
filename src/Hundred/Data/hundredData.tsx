import { useWeb3React } from "@web3-react/core"
import { useEffect, useRef, useState } from "react"
import { useGlobalContext } from "../../Types/globalContext"
import { ethers } from "ethers"
import {AppState, EapData, loadAppState} from "../../Classes/AppState";
import {zeroAppState} from "../../Types/appDataContext";

const useFetchData = () => {
    const networkId = useRef<number>()

    const selectedPoolRef = useRef<EapData>()
    const accountRef = useRef<string | null | undefined>()

    const [appState, setAppState] = useState<AppState>(zeroAppState)
    const [selectedPool, setSelectedPool] = useState<EapData>()

    const {network} = useGlobalContext()
    const {library, account, chainId} = useWeb3React()

    useEffect(() => {
        selectedPoolRef.current = selectedPool
    }, [selectedPool])

    useEffect(() => {
        accountRef.current = account
    }, [account])

    useEffect(() => {
        setAppState(zeroAppState)
        setSelectedPool(undefined)
        if (network) {
            if (account && library && network.chainId === chainId) {
                networkId.current = {...network}.chainId
                //setSpinnerVisible(true)
                fetchAppState()
            } else if (!chainId) {
                networkId.current = {...network}.chainId
                //setSpinnerVisible(true)
                fetchAppState()
            }
        }
    }, [library, network, account])

    const fetchAppState = async () => {
        if (network) {
            const net = {...network}
            const appState = await loadAppState(library || new ethers.providers.JsonRpcProvider(net.publicRpc), net, account as string)
            setAppState(appState)
        }
    }

    const updateAppState = async (): Promise<void> => {
        await fetchAppState()
    }

    return {
        selectedPool,
        setSelectedPool,
        updateAppState,
        appState,
    }
}

 export default useFetchData