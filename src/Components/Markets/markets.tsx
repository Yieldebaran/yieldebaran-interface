import React from "react"
import {MarketContainer, MarketContainerTitle} from "./marketContainer"
import "./style.css"
import PoolList from "./AvailablePools/PoolList"

interface Props {
    supplyMarketDialog: (selectedPool: string) => void,
}
const Markets: React.FC<Props> = (props : Props) => {

    return (
        <div className="markets-wrapper">
            <div className="markets">
                <div className="markets-content">
                    <MarketContainer>
                        <MarketContainerTitle>
                            Effectively allocating pools
                        </MarketContainerTitle>
                        <PoolList supplyMarketDialog={props.supplyMarketDialog}/>
                    </MarketContainer>
                </div>
            </div>
        </div>
    )
}

export default Markets