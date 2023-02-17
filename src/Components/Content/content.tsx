import React, { useState } from "react"
import Markets from "../Markets/markets"
import InteractionDialog from "../Markets/MarketsDialogs/PoolDialog/PoolDialog"
import { useUiContext } from "../../Types/uiContext"
import { useHundredDataContext } from "../../Types/appDataContext"
import {EapData} from "../../Classes/AppState";

const Content: React.FC = () => {
    const {spinnerVisible} = useUiContext()
    const { setSelectedPool } = useHundredDataContext()

    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    
    const supplyMarketDialog = (pool: EapData) => {
        setSelectedPool(pool)
        setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () => {
        if (!spinnerVisible) {
            setOpenSupplyDialog(false)
        }
    }

    // render main logic frame
    return (
        <div className="content">
            <Markets supplyMarketDialog={supplyMarketDialog}
            />
            {openSupplyMarketDialog ? <InteractionDialog closeSupplyMarketDialog={closeSupplyMarketDialog}/> : null}
        </div>
    )
}

export default Content