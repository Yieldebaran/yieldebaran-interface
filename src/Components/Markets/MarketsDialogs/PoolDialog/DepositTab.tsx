import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { useYieldebaranDataContext } from "../../../../Types/appDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import Button from "../../../Button/button";
import {bnFromInput, validateInput} from "../../../../Utils/numbers";
import {approve, deposit, depositEth} from "../../../../Classes/AppState";
import {useGlobalContext} from "../../../../Types/globalContext";

interface Props {
    selectedPool: string
}
const DepositTab:React.FC<Props> = (props: Props) => {
    const {accountEthBalance, updateAppState, eapStates} = useYieldebaranDataContext()
    const {toastErrorMessage, toastSuccessMessage} = useUiContext()

    const {network} = useGlobalContext()

    const mounted = useRef<boolean>(false)

    const [depositInput, setDepositInput] = useState<string>("")
    const [depositErrorMessage, setDepositErrorMessage] = useState<string>("")
    const [ethBalance, setEthBalance] = useState<string>(accountEthBalance.formatted)

    const [ethInput, setEthInput] = useState<string>("")
    const [ethErrorMessage, setEthErrorMessage] = useState<string>("")

    const selectedPoolAddress = props.selectedPool
    const eap = eapStates[selectedPoolAddress]

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        const handleStakeAmountChange = () => {
            setDepositErrorMessage(validateInput(depositInput, eap.accountUnderlyingBalance.formatted))
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
        setDepositInput(String(eap.accountUnderlyingBalance.formatted))
    }

    const setMaxEthDeposit = (): void => {
        setEthInput(ethBalance)
    }

    const handleDeposit = async (amount: bigint) => {
        try {
            if (mounted) setDepositInput("")
            const tx = await deposit(eap.address, amount)
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

    const handleApprove = async () => {
        try {
            // if (mounted) setDepositInput("")
            const tx = await approve(eap.underlying, eap.address, 2n ** 256n - 1n)
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

    const depositBN = bnFromInput(depositInput, eap.decimals)
    const depositEthBN = bnFromInput(ethInput, eap.decimals)

    return (eap && mounted ?
            <>
                <MarketDialogItem
                    title={"Deposited"}
                    value={`${eap.accountAllocated.formatted} ${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Balance"}
                    value={`${eap.accountUnderlyingBalance.formatted} ${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                {eap.isEth &&
                    <MarketDialogItem
                        title={"Native balance"}
                        value={`${accountEthBalance.formatted} ${eap.underlyingSymbol.substring(1)}`}
                    />
                }
                <div className="dialog-line"/>
                <MarketDialogItem
                    toolTipContent={`Performance fee ${eap.performanceFee.formatted}% applied`}
                    title={"Current APY"}
                    value={eap.apyAfterFee[0].apy + '%'}
                />
                <div className="dialog-line" onClick={() => updateAppState()}/>
                <MarketDialogItem
                    toolTipContent={`Performance fee ${eap.performanceFee.formatted}% applied`}
                    title={"7d APY"}
                    value={String(eap.apyAfterFee[1].apy + '%')}
                />
                <div className="dialog-line"/>
                <div className="input-group">
                    <div className="input-button-group">
                        <TextBox
                            disabled={eap.accountUnderlyingBalance.native === 0n}
                            buttonDisabled={depositBN === eap.accountUnderlyingBalance.native}
                            placeholder={eap.underlyingSymbol}
                            value={depositInput}
                            setInput={setDepositInput}
                            validation={depositErrorMessage}
                            button={"Max"}
                            onClick={() => setMaxDeposit()
                        }/>
                        {eap.accountAllowance.native >= depositBN
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
                                onClick={() => handleApprove()}
                            >
                                Approve
                            </Button>
                        }
                    </div>
                </div>
                {eap.isEth &&
                    <div className="input-group">
                        <div className="input-button-group">
                            <TextBox
                                disabled={accountEthBalance.native === 0n}
                                buttonDisabled={depositEthBN === accountEthBalance.native}
                                placeholder={eap.underlyingSymbol.substring(1)}
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
                                    Deposit {eap.underlyingSymbol.substring(1)}
                            </Button>
                        </div>
                    </div>
                }
            </>
            : null
    )
}

export default DepositTab