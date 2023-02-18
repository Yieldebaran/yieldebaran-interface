import React from "react"

import "../style.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { useUiContext } from "../../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import {EapData} from "../../../Classes/AppState";
import {useYieldebaranDataContext} from "../../../Types/appDataContext";
import {formatBN} from "../../../Utils/numbers";

interface Props {
    pool: EapData,
    supplyMarketDialog: (selectedPool: EapData) => void,
}

const PoolRow: React.FC<Props> = (props : Props) => {
    const {appState} = useYieldebaranDataContext()
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
                            {Number(props.pool.apyAfterFee[0].apy).toFixed(2)}%
                        </div>
                </div>
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={props.pool.totalUnderlyingBalance.formatted}>
                        <div>{Number(props.pool.totalUnderlyingBalance.formatted).toFixed(3)}</div>
                    </Tippy>
                }
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={props.pool.accountAllocated.formatted}>
                        <div>{Number(props.pool.accountAllocated.formatted).toFixed(2)}</div>
                    </Tippy>
                }
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={balance}>
                        <div>{Number(balance).toFixed(2)}</div>
                    </Tippy>
                }

            </td>
        </tr>
    )
}

export default PoolRow