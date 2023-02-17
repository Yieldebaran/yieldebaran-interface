import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { useHundredDataContext } from "../../../../Types/appDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import Button from "../../../Button/button";
import {bnFromInput, validateInput} from "../../../../Utils/numbers";
import {deposit, EapData} from "../../../../Classes/AppState";

interface Props {
    selectedPool: EapData
}
const DepositTab:React.FC<Props> = (props: Props) => {
    const {appState} = useHundredDataContext()
    const {toastErrorMessage, toastSuccessMessage} = useUiContext()

    const mounted = useRef<boolean>(false)

    const [depositInput, setDepositInput] = useState<string>("")
    const [depositErrorMessage, setDepositErrorMessage] = useState<string>("")
    const [ethBalance, setEthBalance] = useState<string>(appState.accountEthBalance.formatted)

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
        const handleAppDataChange = () => {
            setEthBalance(appState.accountEthBalance.formatted)
        }
        handleAppDataChange()
    }, [appState])

    useEffect(() => {
        const handleUnstakeAmountChange = () => {
            setEthErrorMessage(validateInput(ethInput, ethBalance))
        }

        handleUnstakeAmountChange()
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
            const tx = await deposit(props.selectedPool.address, amount)

            //setSpinnerVisible(false)
            // const receipt = await tx.wait()
            // console.log(receipt)
            // if (receipt.status === 1) {
            //     toastSuccessMessage("Transaction complete, updating contracts")
            //     await updateMarket(props.eapAddress, UpdateTypeEnum.Stake)
            //     if (mounted) setDepositInput("")
            // } else if (receipt.message) {
            //     toastErrorMessage(`${receipt.message}`);
            // }
        } catch (error: any) {
            console.log(error)
            toastErrorMessage(`${error?.message.replace('.', '')} on Stake}`);
        }
    }

    const depositBN = bnFromInput(depositInput, props.selectedPool.decimals)
    const depositEthBN = bnFromInput(ethInput, props.selectedPool.decimals)

    return (props.selectedPool && mounted ?
            <>
                <MarketDialogItem
                    title={"Your deposit"}
                    value={`${props.selectedPool.accountAllocated.formatted} ${props.selectedPool.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Balance"}
                    value={`${props.selectedPool.accountUnderlyingBalance.formatted} ${props.selectedPool.underlyingSymbol}`}
                />
                {props.selectedPool.isEth &&
                    <MarketDialogItem
                        title={"Native balance"}
                        value={`${appState.accountEthBalance.formatted} ${props.selectedPool.underlyingSymbol.substring(1)}`}
                    />
                }
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Current APY"}
                    value={String(props.selectedPool.apyAfterFee[0].apy)}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"Current APY"}
                    value={String(props.selectedPool.apyAfterFee[0].apy)}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={"24h APY"}
                    value={String(props.selectedPool.apyAfterFee[1].apy)}
                />
                <div className="input-group">
                    <div className="input-button-group">
                        <TextBox
                            disabled={depositBN === props.selectedPool.accountUnderlyingBalance.native}
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
                                Stake
                            </Button>
                            :
                            <Button
                                rectangle={true}
                                loading={false}
                                disabled={depositBN === 0n}
                                onClick={() => handleDeposit(depositBN)}
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
                                disabled={depositEthBN === appState.accountEthBalance.native}
                                placeholder={props.selectedPool.underlyingSymbol.substring(1)}
                                value={ethInput}
                                setInput={setEthInput}
                                validation={ethErrorMessage}
                                button={"Max"}
                                onClick={() => setMaxEthDeposit()}
                            />
                            <Button loading={false} rectangle={true}
                                        disabled={ethInput === "" || ethErrorMessage !== ""}
                                        onClick={() => handleDeposit(depositEthBN)}
                                >
                                    Deposit
                            </Button>
                        </div>
                    </div>
                }
            </>
            : null
    )
}

export default DepositTab