import React, { ReactNode } from "react"
import "./style.css"

interface Props {
    onClick?: () => void,
    children?: ReactNode
}

const MarketContainer: React.FC<Props> = (props : Props) => {
    return(
        <div className="market-container">
            {props.children}
        </div>
    )
}

const MarketContainerTitle : React.FC<Props> = (props : Props) => {
    return(
        <div className="market-container-title">
            {props.children}
        </div>
    )
}


export {
    MarketContainer, 
    MarketContainerTitle,
}

