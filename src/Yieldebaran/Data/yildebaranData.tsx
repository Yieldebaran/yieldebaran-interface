import { useWeb3React } from "@web3-react/core"
import { useEffect, useRef, useState } from "react"
import { useGlobalContext } from "../../Types/globalContext"
import { ethers } from "ethers"
import {loadAppState, EapData} from "../../Classes/AppState";
import {FVal} from "../../Types/appDataContext";

const useFetchData = () => {
    const networkId = useRef<number>()

    const selectedPoolRef = useRef<string>()
    const accountRef = useRef<string | null | undefined>()

    const [eapStates, setEapStates] = useState<{[eap: string]: EapData}>({})
    const [blockNumber, setBlockNumber] = useState<number>(0)
    const [blockTimestamp, setBlockTimestamp] = useState<number>(0)
    const [accountEthBalance, setAccountEthBalance] = useState<FVal>({ native: 0n, formatted: '0.0'})
    const [selectedPool, setSelectedPool] = useState<string>()

    const {network} = useGlobalContext()
    const {library, account, chainId} = useWeb3React()

    useEffect(() => {
        selectedPoolRef.current = selectedPool
    }, [selectedPool])

    useEffect(() => {
        accountRef.current = account
    }, [account])

    useEffect(() => {
        setEapStates({})
        setBlockNumber(0)
        setBlockTimestamp(0)
        setAccountEthBalance({ native: 0n, formatted: '0.0'})
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
        console.log('updating app data')
        if (network) {
            const net = {...network}
            const appState = await loadAppState(library || new ethers.providers.JsonRpcProvider(net.publicRpc), net, account as string)
            setEapStates(appState.states)
            setBlockTimestamp(appState.blockTimestamp)
            setBlockNumber(appState.blockNumber)
            setAccountEthBalance(appState.accountEthBalance)
            console.log('app data updated', appState.blockNumber, appState.accountEthBalance)
            console.log(appState.states)
        }
    }

    const updateAppState = async (): Promise<void> => {
        await fetchAppState()
    }

    return {
        selectedPool,
        setSelectedPool,
        updateAppState,
        blockTimestamp,
        blockNumber,
        eapStates,
        accountEthBalance,
    }
}

 export default useFetchData