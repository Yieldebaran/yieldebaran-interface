import React, { useEffect, useRef, useState } from 'react';

import {
  cancelRequest,
  claimWithdrawal,
  claimWithdrawalEth,
  freeInstantWithdrawal,
  freeInstantWithdrawalEth,
  requestWithdrawal,
} from '../../../../Classes/AppState';
import { useYieldebaranDataContext } from '../../../../Types/appDataContext';
import { useGlobalContext } from '../../../../Types/globalContext';
import { useUiContext } from '../../../../Types/uiContext';
import { bnFromInput, formatBN, validateInput } from '../../../../Utils/numbers';
import { ONE } from '../../../../Yieldebaran/Data/fetchEapsData';
import Button from '../../../Button/button';

import TextBox from '../../../Textbox/textBox';
import '../marketDialog.css';
import MarketDialogItem from '../marketDialogItem';

interface Props {
  selectedPool: string;
}
const WithdrawTab: React.FC<Props> = (props: Props) => {
  const { toastErrorMessage, toastSuccessMessage } = useUiContext();
  const { eapStates, blockTimestamp } = useYieldebaranDataContext();

  const { address } = useGlobalContext();

  const mounted = useRef<boolean>(false);

  const eap = eapStates[props.selectedPool]

  const [withdrawalInput, setWithdrawalInput] = useState<string>('');
  const [withdrawalErrorMessage, setWithdrawalErrorMessage] = useState<string>('');

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleStakeAmountChange = () => {
      setWithdrawalErrorMessage(validateInput(withdrawalInput, eap.accountShares.formatted));
    };

    handleStakeAmountChange();
  }, [withdrawalInput, eap]);

  const setMaxWithdrawal = (): void => {
    setWithdrawalInput(String(eap.accountShares.formatted));
  };

  const handleRequestWithdrawal = async (amount: bigint) => {
    try {
      const tx = await requestWithdrawal(eap.address, address, amount);
      if (mounted) setWithdrawalInput('');
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction successfully mined');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const tx = await cancelRequest(eap.withdrawTool);
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction successfully mined');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const handleClaim = async (claim: boolean) => {
    try {
      let tx;
      if (claim) {
        tx = await claimWithdrawal(eap.withdrawTool);
      } else {
        tx = await freeInstantWithdrawal(eap.withdrawTool);
      }
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction successfully mined');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const handleClaimEth = async (claim: boolean) => {
    try {
      let tx;
      if (claim) {
        tx = await claimWithdrawalEth(eap.withdrawTool);
      } else {
        tx = await freeInstantWithdrawalEth(eap.withdrawTool);
      }
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction successfully mined');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const withdrawalInputBN = bnFromInput(withdrawalInput, eap.decimals);

  const isRequested = eap.accountRequestIndex !== 0;

  const isFulfilled = eap.lastFulfillmentIndex > eap.accountRequestIndex + 1;
  const cancellable = eap.lastFulfillmentIndex === eap.accountRequestIndex;

  const freeWithdrawalDate = new Date(
    (eap.accountRequestTime + eap.requestTimeLimit) * 1000,
  ).toLocaleString();
  const freeWithdrawal = blockTimestamp >= eap.accountRequestTime + eap.requestTimeLimit;

    return (eap && mounted ?
            <>
                <div className="supply-note">This is a delayed withdrawal, it may take up to 48h</div>
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={'Shares balance'}
                    toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${eap.underlyingSymbol}`}
                    value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={'Withdrawal amount'}
                    value={`${eap.accountUnderlyingRequested.formatted} ${eap.underlyingSymbol}`}
                />
                <div className="dialog-line"/>
                <MarketDialogItem
                    title={'Available to withdraw'}
                    value={`${eap.lastFulfillmentIndex > eap.accountRequestIndex + 1 ? eap.accountUnderlyingRequested.formatted : 0} ${eap.underlyingSymbol}`}
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
                            button={'Max'}
                            onClick={() => setMaxWithdrawal()
                        }/>
                        <Button
                            disabled={withdrawalInput === '' || withdrawalErrorMessage !== ''}
                            loading={false} rectangle={true}
                            onClick={() => handleRequestWithdrawal(withdrawalInputBN)}
                        >
                            Withdraw
                        </Button>
                    </div>
                    {<div className="estimated-amount">~{Number(formatBN(withdrawalInputBN * eap.exchangeRate / ONE, eap.decimals)).toFixed(3)} {eap.underlyingSymbol}</div>}
                </div>}
                {isRequested && cancellable &&
                <Button disabled={false} onClick={() => handleCancelRequest()}>
                    Cancel withdrawal
                </Button>}
                {isRequested &&
                <Button
                    disabled={!isFulfilled && !freeWithdrawal}
                    onClick={() => handleClaim(isFulfilled)}>
                    {isFulfilled ? 'Claim funds' : `Funds available from ${freeWithdrawalDate}`}
                </Button>}
                {isRequested && isFulfilled && eap.isEth &&
                <Button
                    disabled={!isFulfilled && !freeWithdrawal}
                    onClick={() => handleClaimEth(isFulfilled)}>
                    Claim funds as {eap.underlyingSymbol.substring(1)}
                </Button>}
            </>
            : null
    )
}

export default WithdrawTab;
