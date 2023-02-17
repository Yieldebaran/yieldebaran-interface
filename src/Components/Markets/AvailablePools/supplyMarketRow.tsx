import React from "react"

import "../style.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { useUiContext } from "../../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import {EapData} from "../../../Classes/AppState";
import {useHundredDataContext} from "../../../Types/appDataContext";
import {formatBN} from "../../../Utils/numbers";

interface Props {
    pool: EapData,
    supplyMarketDialog: (selectedPool: EapData) => void,
}

const SupplyMarketRow: React.FC<Props> = (props : Props) => {
    const {appState} = useHundredDataContext()
    const {setShowWallets} = useUiContext()
    const {account} = useWeb3React<providers.Web3Provider>()

    const handleOpenSupplyMarketDialog = () => {
        if (!account) {
            setShowWallets(true)
            return
        }
        if (props.pool) {
            props.supplyMarketDialog(props.pool)
        }
    }

    const balance = formatBN(props.pool.accountUnderlyingBalance.native + (props.pool.isEth ? appState.accountEthBalance.native : 0n), 18)

    return (
        <tr>
            <td onClick={handleOpenSupplyMarketDialog}>
                <div className="asset">
                    <div className="asset-logo">
                        <img className="rounded-circle" src={props.pool.underlyingLogo} alt=""/>
                    </div>
                    <span>{props.pool.underlyingSymbol}</span>
                </div>
            </td>
            <td className="apy positive"
                onClick={handleOpenSupplyMarketDialog}>
                <div className="supply-apy">
                    <div className="apy-content">
                        {props.pool.apyAfterFee[0].apy}%
                    </div>
                </div>
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={props.pool.totalUnderlyingBalance.formatted}>
                        <div>{props.pool.totalUnderlyingBalance.formatted}</div>
                    </Tippy>
                }
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={props.pool.accountAllocated.formatted}>
                        <div>{props.pool.accountAllocated.formatted}</div>
                    </Tippy>
                }
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={balance}>
                        <div>{balance}</div>
                    </Tippy>
                }

            </td>
        </tr>
    )
}

export default SupplyMarketRow