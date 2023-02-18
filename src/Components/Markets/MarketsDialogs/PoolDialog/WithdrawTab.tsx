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
    requestWithdrawal
} from "../../../../Classes/AppState";
import {useGlobalContext} from "../../../../Types/globalContext";
import {ONE} from "../../../../Yieldebaran/Data/fetchEapsData";
import {useYieldebaranDataContext} from "../../../../Types/appDataContext";

interface Props {
    selectedPool: string
}
const WithdrawTab:React.FC<Props> = (props: Props) => {
    const {toastErrorMessage, toastSuccessMessage} = useUiContext()
    const {eapStates} = useYieldebaranDataContext()

    const {address} = useGlobalContext()

    const mounted = useRef<boolean>(false)

    const eap = eapStates[props.selectedPool]

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
            setWithdrawalErrorMessage(validateInput(withdrawalInput, eap.accountShares.formatted))
        }

        handleStakeAmountChange()
    }, [withdrawalInput])

    const setMaxWithdrawal = (): void => {
        setWithdrawalInput(String(eap.accountShares.formatted))
    }

    const handleRequestWithdrawal = async (amount: bigint) => {
        try {
            const tx = await requestWithdrawal(eap.address, address, amount)
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
            const tx = await cancelRequest(eap.withdrawTool)
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
            const tx = await claimWithdrawal(eap.withdrawTool)
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
            const tx = await claimWithdrawalEth(eap.withdrawTool)
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

    const withdrawalInputBN = bnFromInput(withdrawalInput, eap.decimals)

    const isRequested = eap.accountRequestIndex !== 0

    const isFulfilled = eap.lastFulfillmentIndex > eap.accountRequestIndex

    return (eap && mounted ?
            <>
                <div className="supply-note">NOTE: this is a delayed withdrawal, it may take up to 48h</div>
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Shares balance"}
                    toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${eap.underlyingSymbol}`}
                    value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Requested to withdraw"}
                    value={`${eap.accountUnderlyingRequested.formatted} ${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Available to claim"}
                    value={`${eap.lastFulfillmentIndex > eap.accountRequestIndex ? eap.accountUnderlyingRequested.formatted : 0} ${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                {!isRequested && <div className="input-group">
                    <div className="input-button-group">
                        <TextBox
                            disabled={eap.accountShares.native === 0n}
                            buttonDisabled={withdrawalInputBN === eap.accountShares.native}
                            placeholder={`y${eap.underlyingSymbol}`}
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
                    {<div>~{Number(formatBN(withdrawalInputBN * eap.exchangeRate / ONE, eap.decimals)).toFixed(3)} {eap.underlyingSymbol}</div>}
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
                {isRequested && isFulfilled && eap.isEth &&
                <Button
                    disabled={false}
                    onClick={() => handleClaimEth()}>
                    Claim as {eap.underlyingSymbol.substring(1)}
                </Button>}
            </>
            : null
    )
}

export default WithdrawTab