import React, {useEffect, useRef, useState} from "react"
import { Network } from "../../../networks"
import { useGlobalContext } from "../../../Types/globalContext"
import { useUiContext } from "../../../Types/uiContext"
import Button from "../../Button/button"


const NetworkButton : React.FC = () => {
    const {setOpenNetwork, setMobileMenuOpen, openNetwork} = useUiContext()
    const {network} = useGlobalContext()
    const [lastOpenNetwork, setLastOpenNetwork] = useState(false)
    const netWorkRef = useRef<Network | null>(null)
    netWorkRef.current = network

    useEffect(() => {
        const temp = {...network} as Network
        if (temp)
            netWorkRef.current = temp
        if (lastOpenNetwork && !openNetwork && (!network || String(network) === 'null')) {
            // console.log('no network detected, show network modal')
            // setOpenNetwork(true)
        }
        setLastOpenNetwork(openNetwork)
    }, [network, openNetwork])

    const handleOpenNetworks = (): void => {
        setMobileMenuOpen(false)
        setOpenNetwork(true)
    }

    return (
        netWorkRef.current ?
            <Button onClick={() => handleOpenNetworks()} arrow={true}
                    image={<img src={netWorkRef.current?.logo} alt=""/>}>
                {netWorkRef.current?.network}
            </Button>
            :
            <Button onClick={() => handleOpenNetworks()} arrow={true}>
                <span className="network-name">Networks</span>
            </Button>
    )
}

export default NetworkButton