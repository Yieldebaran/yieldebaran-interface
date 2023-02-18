import React, { ReactNode } from "react"
import "./wrapper.css"

interface Props {
    children?: ReactNode
}

const Wrapper: React.FC<Props> = (props:Props) => {
    return (
        <section className={`wrapper `}>
            {props.children}
        </section>
    )
}

export default Wrapper