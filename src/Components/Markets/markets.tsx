import React from "react"
import {MarketContainer, MarketContainerTitle} from "./marketContainer"
import "./style.css"
import PoolList from "./AvailablePools/poolList"
import {EapData} from "../../Classes/AppState";

interface Props {
    supplyMarketDialog: (selectedPool: EapData) => void,
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