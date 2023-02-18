import React, {PropsWithChildren} from "react"
import Modal from "react-modal"
import "./messageDialog.css"

Modal.setAppElement("#root")

interface Props {
    isOpen: boolean,
    onRequestClose: ()=> void,
    contentLabel: string,
    message: HTMLElement | HTMLElement[] | string | any,
    className?: string
    children?: React.ReactElement | React.ReactElement[]
}
const YieldebaranMessage:React.FC<Props> = (props: Props) => {
    return(
        props.isOpen ?
        <Modal isOpen={props.isOpen}
                onRequestClose={props.onRequestClose}
                contentLabel={props.contentLabel}
                className={`mymodal theme ${props.className ? props.className : ""}`}
                overlayClassName="myoverlay"
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                shouldFocusAfterRender={true}
                shouldReturnFocusAfterClose={true}
                closeTimeoutMS={50}>
                <YieldebaranMessageTitle onRequestClose={props.onRequestClose} darkMode={props.className?.includes("mymodal-dark") ? true : false}>{props.contentLabel}</YieldebaranMessageTitle>
                <YieldebaranMessageItem>{props.message}</YieldebaranMessageItem>
        </Modal>
        : null
    )
}

interface TitleProps {
    onRequestClose: () => void,
    darkMode: boolean
}

const YieldebaranMessageTitle: React.FC<PropsWithChildren<TitleProps>> = ({onRequestClose, darkMode, children}) => {
    return (
        <div className="yieldebaran-message-title title title18">
            {children}
            <svg className="closeBtn" onClick={onRequestClose} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7L17 17" stroke={`${darkMode ? "white" : "black"}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 17L17 7" stroke={`${darkMode ? "white" : "black"}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

interface ItemProps {
    disabled?: boolean,
    hover?: boolean,
    onClick?: () => void
}

const YieldebaranMessageItem: React.FC<PropsWithChildren<ItemProps>> = ({disabled, hover, onClick, children}) => {
    return (
        <div className={`yieldebaran-message-item ${disabled ? "yieldebaran-message-item-disabled" : ""} ${hover && !disabled ? "yieldebaran-message-item-hover" : ""}`} onClick={onClick}>
            {children}
        </div>
    )
}

export default YieldebaranMessage
