import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';

import {
  cancelRequest,
  claimWithdrawal,
  claimWithdrawalEth,
  freeInstantWithdrawal,
  freeInstantWithdrawalEth,
  requestWithdrawal,
} from 'src/Classes/AppState';
import Button from 'src/Components/Button/button';
import MarketDialogItem from 'src/Components/Markets/MarketsDialogs/marketDialogItem';
import TextBox from 'src/Components/Textbox/textBox';
import { useYieldebaranDataContext } from 'src/Types/appDataContext';
import { useGlobalContext } from 'src/Types/globalContext';
import { bnFromInput, formatBN, validateInput } from 'src/Utils/numbers';
import { toastError, toastSuccess } from 'src/utils/toast';
import { ONE } from 'src/Yieldebaran/Data/fetchEapsData';

import '../marketDialog.css';

const log = debug('components:WithdrawTab');

interface Props {
  selectedPool: string;
}
const WithdrawTab: React.FC<Props> = (props: Props) => {
  const { eapStates, blockTimestamp } = useYieldebaranDataContext();

  const { address } = useGlobalContext();

  const mounted = useRef<boolean>(false);

  const eap = eapStates[props.selectedPool];

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
      log('handleRequestWithdrawal receipt', receipt);
      toastSuccess('Transaction successfully mined');
    } catch (error: any) {
      if (!error) {
        toastError('Unhandled error');
        return;
      }
      if (error.code === 'ACTION_REJECTED') {
        toastError('User denied transaction signature');
        return;
      }
      toastError(`${error?.message.replace('.', '')}`);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const tx = await cancelRequest(eap.withdrawTool);
      const receipt = await tx.wait();
      log('handleCancelRequest receipt', receipt);
      toastSuccess('Transaction successfully mined');
    } catch (error: any) {
      if (!error) {
        toastError('Unhandled error');
        return;
      }
      if (error.code === 'ACTION_REJECTED') {
        toastError('User denied transaction signature');
        return;
      }
      toastError(`${error?.message.replace('.', '')}`);
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
      log('handleClaim receipt', receipt);
      toastSuccess('Transaction successfully mined');
    } catch (error: any) {
      if (!error) {
        toastError('Unhandled error');
        return;
      }
      if (error.code === 'ACTION_REJECTED') {
        toastError('User denied transaction signature');
        return;
      }
      toastError(`${error?.message.replace('.', '')}`);
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
      log('handleClaimEth receipt', receipt);
      toastSuccess('Transaction successfully mined');
    } catch (error: any) {
      if (!error) {
        toastError('Unhandled error');
        return;
      }
      if (error.code === 'ACTION_REJECTED') {
        toastError('User denied transaction signature');
        return;
      }
      toastError(`${error?.message.replace('.', '')}`);
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

  return eap && mounted ? (
    <>
      <div className="supply-note">This is a delayed withdrawal, it may take up to 48h</div>
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Shares balance'}
        toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${
          eap.underlyingSymbol
        }`}
        value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Withdrawal amount'}
        value={`${eap.accountUnderlyingRequested.formatted} ${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Available to withdraw'}
        value={`${
          eap.lastFulfillmentIndex > eap.accountRequestIndex + 1
            ? eap.accountUnderlyingRequested.formatted
            : 0
        } ${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
      {!isRequested && (
        <div className="input-group">
          <div className="input-button-group">
            <TextBox
              disabled={eap.accountShares.native === 0n}
              buttonDisabled={withdrawalInputBN === eap.accountShares.native}
              placeholder={`y${eap.underlyingSymbol}`}
              value={withdrawalInput}
              setInput={setWithdrawalInput}
              validation={withdrawalErrorMessage}
              button={'Max'}
              onClick={() => setMaxWithdrawal()}
            />
            <Button
              disabled={withdrawalInput === '' || withdrawalErrorMessage !== ''}
              loading={false}
              rectangle={true}
              onClick={() => handleRequestWithdrawal(withdrawalInputBN)}
            >
              Withdraw
            </Button>
          </div>
          {
            <div className="estimated-amount">
              ~
              {Number(formatBN((withdrawalInputBN * eap.exchangeRate) / ONE, eap.decimals)).toFixed(
                3,
              )}{' '}
              {eap.underlyingSymbol}
            </div>
          }
        </div>
      )}
      {isRequested && cancellable && (
        <Button disabled={false} onClick={() => handleCancelRequest()}>
          Cancel withdrawal
        </Button>
      )}
      {isRequested && (
        <Button disabled={!isFulfilled && !freeWithdrawal} onClick={() => handleClaim(isFulfilled)}>
          {isFulfilled ? 'Claim funds' : `Funds available from ${freeWithdrawalDate}`}
        </Button>
      )}
      {isRequested && isFulfilled && eap.isEth && (
        <Button
          disabled={!isFulfilled && !freeWithdrawal}
          onClick={() => handleClaimEth(isFulfilled)}
        >
          Claim funds as {eap.underlyingSymbol.substring(1)}
        </Button>
      )}
    </>
  ) : null;
};

export default WithdrawTab;
