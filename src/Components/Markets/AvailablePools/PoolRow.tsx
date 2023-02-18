import React from "react"

import "../style.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { useUiContext } from "../../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import {useYieldebaranDataContext} from "../../../Types/appDataContext";
import {formatBN} from "../../../Utils/numbers";

interface Props {
    pool: string,
    supplyMarketDialog: (selectedPool: string) => void,
}

const PoolRow: React.FC<Props> = (props : Props) => {
    const {accountEthBalance, eapStates} = useYieldebaranDataContext()
    const {setShowWallets} = useUiContext()
    const {account} = useWeb3React<providers.Web3Provider>()

    const eap = eapStates[props.pool]

    const handleOpenSupplyMarketDialog = () => {
        if (!account) {
            setShowWallets(true)
            return
        }
        if (props.pool) {
            props.supplyMarketDialog(props.pool)
        }
    }

    const balance = formatBN(eap.accountUnderlyingBalance.native + (eap.isEth ? accountEthBalance.native : 0n), 18)

    return (
        <tr>
            <td onClick={handleOpenSupplyMarketDialog}>
                <div className="asset">
                    <div className="asset-logo">
                        <img className="rounded-circle" src={eap.underlyingLogo} alt=""/>
                    </div>
                    <span>{eap.underlyingSymbol}</span>
                </div>
            </td>
            <td className="apy positive"
                onClick={handleOpenSupplyMarketDialog}>
                <div className="supply-apy">
                        <div className="apy-content">
                            {Number(eap.apyAfterFee[0].apy).toFixed(2)}%
                        </div>
                </div>
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={eap.totalUnderlyingBalance.formatted}>
                        <div>{Number(eap.totalUnderlyingBalance.formatted).toFixed(3)}</div>
                    </Tippy>
                }
            </td>
            <td onClick={handleOpenSupplyMarketDialog}>
                {
                    <Tippy content={eap.accountAllocated.formatted}>
                        <div>{Number(eap.accountAllocated.formatted).toFixed(2)}</div>
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