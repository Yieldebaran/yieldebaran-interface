import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { useUiContext } from "../../../../Types/uiContext";
import Button from "../../../Button/button";
import {bnFromInput, formatBN, validateInput} from "../../../../Utils/numbers";
import {
    EapData, instantWithdrawal, instantWithdrawalEth,
} from "../../../../Classes/AppState";
import {useGlobalContext} from "../../../../Types/globalContext";
import {ONE} from "../../../../Yieldebaran/Data/fetchEapsData";

interface Props {
    selectedPool: EapData
}
const InstantWithdrawTab:React.FC<Props> = (props: Props) => {
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
        setWithdrawalInput(String(sharesWithdrawable.formatted))
    }

    const handleInstantWithdrawal = async (pool: string, amount: bigint, minFromBalance: bigint, account: string) => {
        try {
            const tx = await instantWithdrawal(pool, amount, minFromBalance, account)
            setWithdrawalInput("")
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

    const handleInstantWithdrawalEth = async (pool: string, amount: bigint, minFromBalance: bigint, account: string) => {
        try {
            const tx = await instantWithdrawalEth(pool, amount, minFromBalance, account)
            setWithdrawalInput("")
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

    const sharesWithdrawable = props.selectedPool.sharesWithdrawable.native > props.selectedPool.accountShares.native ? props.selectedPool.accountShares : props.selectedPool.sharesWithdrawable
    const underlyingWithdrawable = sharesWithdrawable.native * props.selectedPool.exchangeRate / ONE

    const minFromBalance = props.selectedPool.underlyingUnallocated.native > withdrawalInputBN ? withdrawalInputBN : props.selectedPool.underlyingUnallocated.native

    return (props.selectedPool && mounted ?
            <>
                <div className="supply-note">NOTE: instant withdrawal applies {props.selectedPool.instantWithdrawalFee.formatted}% fee</div>
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Shares balance"}
                    toolTipContent={`~${Number(props.selectedPool.accountAllocated.formatted).toFixed(3)} ${props.selectedPool.underlyingSymbol}`}
                    value={`${props.selectedPool.accountShares.formatted} y${props.selectedPool.underlyingSymbol}`}
                />
                {props.selectedPool.underlyingUnallocated.native !== 0n &&<div className="dialog-line"/>}
                {props.selectedPool.underlyingUnallocated.native !== 0n &&
                <MarketDialogItem
                    title={"No fee amount"}
                    value={`${props.selectedPool.underlyingUnallocated.formatted} ${props.selectedPool.underlyingSymbol}`}
                />}
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Withdrawable"}
                    toolTipContent={`~${Number(formatBN(underlyingWithdrawable, props.selectedPool.decimals)).toFixed(3)} ${props.selectedPool.underlyingSymbol}`}
                    value={`${sharesWithdrawable.formatted} y${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
               <div className="input-group">
                        <TextBox
                            placeholder={`0 y${props.selectedPool.underlyingSymbol}`}
                            disabled={props.selectedPool.accountShares.native === 0n}
                            value={withdrawalInput}
                            setInput={setWithdrawalInput}
                            validation={withdrawalErrorMessage}
                            button={"Max"}
                            onClick={()=>setMaxWithdrawal()}/>
                    <div>You will get ~{Number(formatBN(calculateInstantWithdrawal(withdrawalInputBN, props.selectedPool), props.selectedPool.decimals)).toFixed(3)} {props.selectedPool.underlyingSymbol}</div>
                </div>
                <Button
                    disabled={withdrawalInputBN == 0n || withdrawalErrorMessage !== ""}
                    onClick={() => handleInstantWithdrawal(props.selectedPool.address, withdrawalInputBN, minFromBalance, address)}>
                    Withdraw
                </Button>
                {props.selectedPool.isEth && <Button
                    disabled={withdrawalInputBN == 0n || withdrawalErrorMessage !== ""}
                    onClick={() => handleInstantWithdrawalEth(props.selectedPool.address, withdrawalInputBN, minFromBalance, address)}>
                    Withdraw as {props.selectedPool.underlyingSymbol.substring(1)}
                </Button>}
            </>
            : null
    )
}

function calculateInstantWithdrawal(shares: bigint, eap: EapData): bigint {
    if (shares === 0n) return 0n
    const underlyingAmount = shares * eap.exchangeRate / ONE
    const balance = eap.underlyingUnallocated.native
    if (balance > underlyingAmount) {
        return underlyingAmount
    }
    const amountToApplyFee = underlyingAmount - balance
    const amountAfterFee = amountToApplyFee * (ONE - eap.instantWithdrawalFee.native) / ONE
    return balance + amountAfterFee
}

export default InstantWithdrawTab