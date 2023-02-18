import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { useYieldebaranDataContext } from "../../../../Types/appDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import Button from "../../../Button/button";
import {bnFromInput, validateInput} from "../../../../Utils/numbers";
import {approve, deposit, depositEth, EapData} from "../../../../Classes/AppState";
import {useGlobalContext} from "../../../../Types/globalContext";

interface Props {
    selectedPool: EapData
}
const DepositTab:React.FC<Props> = (props: Props) => {
    const {accountEthBalance, updateAppState} = useYieldebaranDataContext()
    const {toastErrorMessage, toastSuccessMessage} = useUiContext()

    const {network} = useGlobalContext()

    const mounted = useRef<boolean>(false)

    const [depositInput, setDepositInput] = useState<string>("")
    const [depositErrorMessage, setDepositErrorMessage] = useState<string>("")
    const [ethBalance, setEthBalance] = useState<string>(accountEthBalance.formatted)

    const [ethInput, setEthInput] = useState<string>("")
    const [ethErrorMessage, setEthErrorMessage] = useState<string>("")

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        const handleStakeAmountChange = () => {
            setDepositErrorMessage(validateInput(depositInput, props.selectedPool.accountUnderlyingBalance.formatted))
        }

        handleStakeAmountChange()
    }, [depositInput])

    useEffect(() => {
        const handleEthBalance = () => {
            console.log('handleEthBalance', accountEthBalance.formatted)
            setEthBalance(accountEthBalance.formatted)
        }
        handleEthBalance()
    }, [accountEthBalance])

    useEffect(() => {
        const handleEthAmountChange = () => {
            setEthErrorMessage(validateInput(ethInput, ethBalance))
        }

        handleEthAmountChange()
        // eslint-disable-next-line
    }, [ethInput, ethBalance])

    const setMaxDeposit = (): void => {
        setDepositInput(String(props.selectedPool.accountUnderlyingBalance.formatted))
    }

    const setMaxEthDeposit = (): void => {
        setEthInput(ethBalance)
    }

    const handleDeposit = async (amount: bigint) => {
        try {
            if (mounted) setDepositInput("")
            const tx = await deposit(props.selectedPool.address, amount)
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
                // await updateMarket(props.eapAddress, UpdateTypeEnum.Stake)
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const handleApprove = async (amount: bigint) => {
        try {
            // if (mounted) setDepositInput("")
            const tx = await approve(props.selectedPool.underlying, props.selectedPool.address, amount)
            const receipt = await tx.wait()
            console.log(receipt)
            if (receipt.status === 1) {
                toastSuccessMessage("Transaction complete, updating contracts")
                // await updateMarket(props.eapAddress, UpdateTypeEnum.Stake)
                // if (mounted) setDepositInput("")
            } else if (receipt.message) {
                toastErrorMessage(`${receipt.message}`);
            }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')}`);
        }
    }

    const handleDepositEth = async (amount: bigint) => {
        if (!network) return
        try {
            if (mounted) setEthInput("")
            const tx = await depositEth(network.ethAdapter, amount)
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

    const depositBN = bnFromInput(depositInput, props.selectedPool.decimals)
    const depositEthBN = bnFromInput(ethInput, props.selectedPool.decimals)

    return (props.selectedPool && mounted ?
            <>
                <MarketDialogItem
                    title={"Deposited"}
                    value={`${props.selectedPool.accountAllocated.formatted} ${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Balance"}
                    value={`${props.selectedPool.accountUnderlyingBalance.formatted} ${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                {props.selectedPool.isEth &&
                    <MarketDialogItem
                        title={"Native balance"}
                        value={`${accountEthBalance.formatted} ${props.selectedPool.underlyingSymbol.substring(1)}`}
                    />
                }
                <div className="dialog-line"/>
                <MarketDialogItem
                    toolTipContent={`Performance fee ${props.selectedPool.performanceFee.formatted}% applied`}
                    title={"Current APY"}
                    value={props.selectedPool.apyAfterFee[0].apy + '%'}
                />
                <div className="dialog-line" onClick={() => updateAppState()}/>
                <MarketDialogItem
                    toolTipContent={`Performance fee ${props.selectedPool.performanceFee.formatted}% applied`}
                    title={"7d APY"}
                    value={String(props.selectedPool.apyAfterFee[1].apy + '%')}
                />
                <div className="dialog-line"/>
                <div className="input-group">
                    <div className="input-button-group">
                        <TextBox
                            disabled={props.selectedPool.accountUnderlyingBalance.native === 0n}
                            buttonDisabled={depositBN === props.selectedPool.accountUnderlyingBalance.native}
                            placeholder={props.selectedPool.underlyingSymbol}
                            value={depositInput}
                            setInput={setDepositInput}
                            validation={depositErrorMessage}
                            button={"Max"}
                            onClick={() => setMaxDeposit()
                        }/>
                        {props.selectedPool.accountAllowance.native >= depositBN
                            ?
                            <Button
                                disabled={depositInput === "" || depositErrorMessage !== ""}
                                loading={false} rectangle={true}
                                onClick={() => handleDeposit(depositBN)}
                            >
                                Deposit
                            </Button>
                            :
                            <Button
                                rectangle={true}
                                loading={false}
                                disabled={depositBN === 0n}
                                onClick={() => handleApprove(depositBN)}
                            >
                                Approve
                            </Button>
                        }
                    </div>
                </div>
                {props.selectedPool.isEth &&
                    <div className="input-group">
                        <div className="input-button-group">
                            <TextBox
                                disabled={accountEthBalance.native === 0n}
                                buttonDisabled={depositEthBN === accountEthBalance.native}
                                placeholder={props.selectedPool.underlyingSymbol.substring(1)}
                                value={ethInput}
                                setInput={setEthInput}
                                validation={ethErrorMessage}
                                button={"Max"}
                                onClick={() => setMaxEthDeposit()}
                            />
                            <Button loading={false} rectangle={true}
                                        disabled={ethInput === "" || ethErrorMessage !== ""}
                                        onClick={() => handleDepositEth(depositEthBN)}
                                >
                                    Deposit {props.selectedPool.underlyingSymbol.substring(1)}
                            </Button>
                        </div>
                    </div>
                }
            </>
            : null
    )
}

export default DepositTab