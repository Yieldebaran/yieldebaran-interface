import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { useUiContext } from "../../../../Types/uiContext";
import Button from "../../../Button/button";
import {bnFromInput, formatBN, validateInput} from "../../../../Utils/numbers";
import {
    cancelRequest,
    claimWithdrawal, claimWithdrawalEth,
    EapData,
    requestWithdrawal
} from "../../../../Classes/AppState";
import {useGlobalContext} from "../../../../Types/globalContext";
import {ONE} from "../../../../Hundred/Data/fetchEapsData";

interface Props {
    selectedPool: EapData
}
const WithdrawTab:React.FC<Props> = (props: Props) => {
    const {toastErrorMessage, toastSuccessMessage} = useUiContext()

    const {address} = useGlobalContext()

    const mounted = useRef<boolean>(false)

    const [withdrawalInput, setWithdrawalInput] = useState<string>("")
    const [withdrawalErrorMessage, setWithdrawalErrorMessage] = useState<string>("")

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        const handleStakeAmountChange = () => {
            setWithdrawalErrorMessage(validateInput(withdrawalInput, props.selectedPool.accountShares.formatted))
        }

        handleStakeAmountChange()
    }, [withdrawalInput])

    const setMaxWithdrawal = (): void => {
        setWithdrawalInput(String(props.selectedPool.accountShares.formatted))
    }

    const handleRequestWithdrawal = async (amount: bigint) => {
        try {
            const tx = await requestWithdrawal(props.selectedPool.address, address, amount)
            if (mounted) setWithdrawalInput("")
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const handleCancelRequest = async () => {
        try {
            const tx = await cancelRequest(props.selectedPool.withdrawTool)
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const handleClaim = async () => {
        try {
            const tx = await claimWithdrawal(props.selectedPool.withdrawTool)
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const handleClaimEth = async () => {
        try {
            const tx = await claimWithdrawalEth(props.selectedPool.withdrawTool)
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const withdrawalInputBN = bnFromInput(withdrawalInput, props.selectedPool.decimals)

    const isRequested = props.selectedPool.accountRequestIndex !== 0

    const isFulfilled = props.selectedPool.lastFulfillmentIndex > props.selectedPool.accountRequestIndex

    return (props.selectedPool && mounted ?
            <>
                <div className="supply-note">NOTE: this is a delayed withdrawal, it may take up to 48h</div>
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Shares balance"}
                    toolTipContent={`~${Number(props.selectedPool.accountAllocated.formatted).toFixed(3)} ${props.selectedPool.underlyingSymbol}`}
                    value={`${props.selectedPool.accountShares.formatted} y${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Requested to withdraw"}
                    value={`${props.selectedPool.accountUnderlyingRequested.formatted} ${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Available to claim"}
                    value={`${props.selectedPool.lastFulfillmentIndex > props.selectedPool.accountRequestIndex ? props.selectedPool.accountUnderlyingRequested.formatted : 0} ${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                {!isRequested && <div className="input-group">
                    <div className="input-button-group">
                        <TextBox
                            disabled={props.selectedPool.accountShares.native === 0n}
                            buttonDisabled={withdrawalInputBN === props.selectedPool.accountShares.native}
                            placeholder={`y${props.selectedPool.underlyingSymbol}`}
                            value={withdrawalInput}
                            setInput={setWithdrawalInput}
                            validation={withdrawalErrorMessage}
                            button={"Max"}
                            onClick={() => setMaxWithdrawal()
                        }/>
                        <Button
                            disabled={withdrawalInput === "" || withdrawalErrorMessage !== ""}
                            loading={false} rectangle={true}
                            onClick={() => handleRequestWithdrawal(withdrawalInputBN)}
                        >
                            Request withdrawal
                        </Button>
                    </div>
                    {<div>~{Number(formatBN(withdrawalInputBN * props.selectedPool.exchangeRate / ONE, props.selectedPool.decimals)).toFixed(3)} {props.selectedPool.underlyingSymbol}</div>}
                </div>}
                {isRequested && !isFulfilled &&
                <Button disabled={false} onClick={() => handleCancelRequest()}>
                    Cancel request
                </Button>}
                {isRequested &&
                <Button
                    disabled={!isFulfilled}
                    onClick={() => handleClaim()}>
                    Claim {isFulfilled ? "" : "will be available after the next allocation"}
                </Button>}
                {isRequested && isFulfilled && props.selectedPool.isEth &&
                <Button
                    disabled={false}
                    onClick={() => handleClaimEth()}>
                    Claim as {props.selectedPool.underlyingSymbol.substring(1)}
                </Button>}
            </>
            : null
    )
}

export default WithdrawTab