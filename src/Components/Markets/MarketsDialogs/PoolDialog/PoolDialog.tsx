import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { useHundredDataContext } from "../../../../Types/appDataContext"
import { useUiContext } from "../../../../Types/uiContext"
import closeIcon from "../../../../assets/icons/closeIcon.png"
import ReactToolTip from 'react-tooltip'
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../../TabControl/tabControl"
import "../marketDialog.css"
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
interface Props {
    closeSupplyMarketDialog: () => void,
}

const PoolDialog:React.FC<Props> = (props: Props) => {
    const {selectedPool, setSelectedPool, appState} = useHundredDataContext()
    const {spinnerVisible, darkMode} = useUiContext()
    const [tabChange, setTabChange] = useState<number>(1)
    const [tabHeaders, setTabHeaders] = useState<any[]>([])
    const [tabContents, setTabContents] = useState<any>([])

    const mountedSupply = useRef<boolean>(false)

    const dialogContainer = document.getElementById("modal") as Element

    const CloseDialog = () => {
        if (spinnerVisible)
            return
        props.closeSupplyMarketDialog()
    }

    useEffect(() => {
        mountedSupply.current = true
        setTabChange(1)
        return () => {
            setSelectedPool(undefined)
            mountedSupply.current = false
        }
    }, [])

    useEffect(() => {
        if (selectedPool && mountedSupply.current) {
            const headers = []
            const contents = []
            headers.push({title: "Deposit"})
            contents.push(<DepositTab selectedPool={selectedPool}/>)
            // headers.push({title: "Stake"})
            // contents.push(<DirectStakeMarketTab selectedPool={selectedPool}/>)

            headers.push({title: "Withdraw"})
            contents.push(<WithdrawTab selectedPool={selectedPool}/>)
            // contents.push(<InstantWithdrawalTab selectedPool={selectedPool}/>)

            headers.push({title: "Fast withdraw"})
            contents.push(<DepositTab selectedPool={selectedPool}/>)
            // contents.push(<WithdrawItem selectedPool={selectedPool}/>)

            setTabHeaders(headers)
            setTabContents(contents)
        }
    }, [selectedPool])


    const dialog = mountedSupply.current && selectedPool && tabHeaders.length > 0 ?
        <div className={`dialog ${"open-dialog"} ${darkMode ? "dark" : "light"}`}>
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
            <div className="dialog-background" onClick={() => CloseDialog()}></div>
            <div
                className="supply-box">
                <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={() => CloseDialog()}/>
                <div className="dialog-title">
                    {selectedPool && appState.states.length && (
                        <div className="logo-container">
                            <img
                                className="rounded-circle"
                                style={{width: "30px", height: "30px"}}
                                src={selectedPool.underlyingLogo}
                                alt=""/>
                        </div>
                    )}
                    {selectedPool && appState.states.length && `${selectedPool.underlyingSymbol}`}
                </div>
                <div className="seperator"/>
                <Tab>
                    <TabHeader tabChange={tabChange}>
                        {tabHeaders.map((h, index) => {
                            return <TabHeaderItem key={index} tabId={index + 1} title={h.title} tabChange={tabChange}
                                                  setTabChange={setTabChange}/>
                        })}
                    </TabHeader>
                    <TabContent>
                        {(tabContents as any[]).map((c, index) => {
                            return (<TabContentItem key={index} tabId={index + 1} tabChange={tabChange} open={true}>
                                {c}
                            </TabContentItem>)
                        })}
                    </TabContent>
                </Tab>
            </div>
        </div>
        : null

    return (
        ReactDOM.createPortal(dialog, dialogContainer)
    )
}

export default PoolDialog