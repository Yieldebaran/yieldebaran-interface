import React, { useEffect } from 'react';
import '../style.css';
import PoolRow from './PoolRow';
import ReactTooltip from 'react-tooltip';
import { useHundredDataContext } from '../../../Types/appDataContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {EapData} from "../../../Classes/AppState"; // optional

interface Props {
    supplyMarketDialog: (selectedPool: EapData) => void;
}

const PoolList: React.FC<Props> = (props: Props) => {
    const {appState} = useHundredDataContext()

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    return (
        <div className="market-content">
            <table className="market-table">
                <thead className="market-table-header">
                <tr>
                    <th colSpan={5}>
                        <div className='seperator'/>
                    </th>
                </tr>
                <tr className='market-table-header-headers'>
                    <th className='market-header-title'>Asset</th>
                    <th className='market-header-title'>
                        APY
                        <Tippy content={
                            <div style={{width: "12rem"}}>Learn about APR{' '}
                                <a className="a" target="_blank" rel="noreferrer"
                                   href="https://docs.hundred.finance/protocol-governance/hnd-staking-and-locking/boosting-apr-with-vehnd">here</a>
                            </div>} interactive={true}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#015CB1"
                                 className="info-circle" viewBox="0 0 16 16"
                                 style={{userSelect: "none", outline: "none", cursor: "pointer"}}>
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path
                                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                        </Tippy>
                    </th>

                    <th className='market-header-title'>Total assets</th>
                    <th className='market-header-title'>Your deposit</th>
                    <th className='market-header-title'>On wallet</th>
                </tr>
                <tr>
                    <th colSpan={5}>
                        <div className='seperator'/>
                    </th>
                </tr>
                </thead>
                {
                    <tbody className="market-table-content">
                    {appState.states.length > 0 ? [...appState.states]
                        .map((pool, index) => {
                            return (
                                <PoolRow
                                    key={index}
                                    pool={pool}
                                    supplyMarketDialog={props.supplyMarketDialog}
                                />
                            )
                        }) : null}
                    </tbody>
                }
            </table>
        </div>
    );
}

export default PoolList;
