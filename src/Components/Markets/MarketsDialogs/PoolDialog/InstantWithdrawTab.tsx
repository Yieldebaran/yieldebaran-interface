import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';

import { EapData, instantWithdrawal, instantWithdrawalEth } from 'src/Classes/AppState';

import Button from 'src/Components/Button/button';
import MarketDialogItem from 'src/Components/Markets/MarketsDialogs/marketDialogItem';

import TextBox from 'src/Components/Textbox/textBox';
import { useYieldebaranDataContext } from 'src/Types/appDataContext';
import { useGlobalContext } from 'src/Types/globalContext';
import { bnFromInput, formatBN, validateInput } from 'src/Utils/numbers';
import { toastError, toastSuccess } from 'src/utils/toast';
import { ONE } from 'src/Yieldebaran/Data/fetchEapsData';

import '../marketDialog.css';

const log = debug('components:InstantWithdrawTab');

interface Props {
  selectedPool: string;
}

const InstantWithdrawTab: React.FC<Props> = (props: Props) => {
  const { eapStates } = useYieldebaranDataContext();

  const { address } = useGlobalContext();

  const mounted = useRef<boolean>(false);

  const [withdrawalInput, setWithdrawalInput] = useState<string>('');
  const [withdrawalErrorMessage, setWithdrawalErrorMessage] = useState<string>('');

  const eap: EapData = eapStates[props.selectedPool];

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
  }, [withdrawalInput]);

  const setMaxWithdrawal = (): void => {
    setWithdrawalInput(String(sharesWithdrawable.formatted));
  };

  const handleInstantWithdrawal = async (
    pool: string,
    amount: bigint,
    minFromBalance: bigint,
    account: string,
  ) => {
    try {
      const tx = await instantWithdrawal(pool, amount, minFromBalance, account);
      setWithdrawalInput('');
      const receipt = await tx.wait();
      log('handleInstantWithdrawal receipt', receipt);
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

  const handleInstantWithdrawalEth = async (
    pool: string,
    amount: bigint,
    minFromBalance: bigint,
    account: string,
  ) => {
    try {
      const tx = await instantWithdrawalEth(pool, amount, minFromBalance, account);
      setWithdrawalInput('');
      const receipt = await tx.wait();
      log('handleInstantWithdrawalEth receipt', receipt);
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

  const sharesWithdrawable =
    eap.sharesWithdrawable.native > eap.accountShares.native
      ? eap.accountShares
      : eap.sharesWithdrawable;
  const underlyingWithdrawable = (sharesWithdrawable.native * eap.exchangeRate) / ONE;

  const minFromBalance =
    eap.underlyingUnallocated.native > withdrawalInputBN
      ? withdrawalInputBN
      : eap.underlyingUnallocated.native;

  const notAllMoneyAvailable = eap.accountAllocated.native > underlyingWithdrawable;

  const noFeeAmount =
    eap.underlyingUnallocated.native > underlyingWithdrawable
      ? underlyingWithdrawable
      : eap.underlyingUnallocated.native;

  return eap && mounted ? (
    <>
      <div className="supply-note">
        Instant withdrawals incur a {eap.instantWithdrawalFee.formatted}% fee
      </div>
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Shares balance'}
        toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${
          eap.underlyingSymbol
        }`}
        value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
      />
      {eap.underlyingUnallocated.native !== 0n && <div className="dialog-line" />}
      {noFeeAmount !== 0n && (
        <MarketDialogItem
          toolTipContent={
            'When there are some unallocated funds (e. g. just deposited funds) it can be withdrawn without a fee'
          }
          title={'No-fee withdrawal'}
          value={`${formatBN(noFeeAmount, eap.decimals)} ${eap.underlyingSymbol}`}
        />
      )}
      <div className="dialog-line" />
      {notAllMoneyAvailable && (
        <MarketDialogItem
          title={'Total withdrawable'}
          toolTipContent={`~${Number(formatBN(underlyingWithdrawable, eap.decimals)).toFixed(3)} ${
            eap.underlyingSymbol
          }`}
          value={`${sharesWithdrawable.formatted} y${eap.underlyingSymbol}`}
        />
      )}
      {notAllMoneyAvailable && (
        <div className="supply-note">
          Currently markets are highly utilized, so not all funds are available for the instant
          withdrawal. But it's temporary.{' '}
        </div>
      )}
      {notAllMoneyAvailable && <div className="dialog-line" />}
      <div className="input-group">
        <TextBox
          placeholder={`0 y${eap.underlyingSymbol}`}
          disabled={eap.accountShares.native === 0n}
          value={withdrawalInput}
          setInput={setWithdrawalInput}
          validation={withdrawalErrorMessage}
          button={'Max'}
          onClick={() => setMaxWithdrawal()}
        />
        <div className="estimated-amount">
          ~
          {Number(
            formatBN(calculateInstantWithdrawal(withdrawalInputBN, eap), eap.decimals),
          ).toFixed(3)}{' '}
          {eap.underlyingSymbol}
        </div>
      </div>
      <Button
        disabled={withdrawalInputBN === 0n || withdrawalErrorMessage !== ''}
        onClick={() =>
          handleInstantWithdrawal(eap.address, withdrawalInputBN, minFromBalance, address)
        }
      >
        Withdraw
      </Button>
      {eap.isEth && (
        <Button
          disabled={withdrawalInputBN === 0n || withdrawalErrorMessage !== ''}
          onClick={() =>
            handleInstantWithdrawalEth(eap.address, withdrawalInputBN, minFromBalance, address)
          }
        >
          Withdraw as {eap.underlyingSymbol.substring(1)}
        </Button>
      )}
    </>
  ) : null;
};

function calculateInstantWithdrawal(shares: bigint, eap: EapData): bigint {
  if (shares === 0n) return 0n;
  const underlyingAmount = (shares * eap.exchangeRate) / ONE;
  const balance = eap.underlyingUnallocated.native;
  if (balance > underlyingAmount) {
    return underlyingAmount;
  }
  const amountToApplyFee = underlyingAmount - balance;
  const amountAfterFee = (amountToApplyFee * (ONE - eap.instantWithdrawalFee.native)) / ONE;
  return balance + amountAfterFee;
}

export default InstantWithdrawTab;
