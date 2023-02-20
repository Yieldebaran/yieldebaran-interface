import React, { useEffect, useRef, useState } from 'react';

import { EapData, instantWithdrawal, instantWithdrawalEth } from '../../../../Classes/AppState';
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

const InstantWithdrawTab: React.FC<Props> = (props: Props) => {
  const { toastErrorMessage, toastSuccessMessage } = useUiContext();
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

  const handleInstantWithdrawal = async (pool: string, amount: bigint, minFromBalance: bigint, account: string) => {
    try {
      const tx = await instantWithdrawal(pool, amount, minFromBalance, account);
      setWithdrawalInput('');
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction complete, updating contracts');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const handleInstantWithdrawalEth = async (pool: string, amount: bigint, minFromBalance: bigint, account: string) => {
    try {
      const tx = await instantWithdrawalEth(pool, amount, minFromBalance, account);
      setWithdrawalInput('');
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        toastSuccessMessage('Transaction complete, updating contracts');
      } else if (receipt.message) {
        toastErrorMessage(`${receipt.message}`);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(`${error?.message.replace('.', '')}`);
    }
  };

  const withdrawalInputBN = bnFromInput(withdrawalInput, eap.decimals);

  const sharesWithdrawable =
    eap.sharesWithdrawable.native > eap.accountShares.native ? eap.accountShares : eap.sharesWithdrawable;
  const underlyingWithdrawable = (sharesWithdrawable.native * eap.exchangeRate) / ONE;

  const minFromBalance =
    eap.underlyingUnallocated.native > withdrawalInputBN ? withdrawalInputBN : eap.underlyingUnallocated.native;

  return eap && mounted ? (
    <>
      <div className="supply-note">NOTE: instant withdrawal applies {eap.instantWithdrawalFee.formatted}% fee</div>
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Shares balance'}
        toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${eap.underlyingSymbol}`}
        value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
      />
      {eap.underlyingUnallocated.native !== 0n && <div className="dialog-line" />}
      {eap.underlyingUnallocated.native !== 0n && (
        <MarketDialogItem
          title={'No fee amount'}
          value={`${eap.underlyingUnallocated.formatted} ${eap.underlyingSymbol}`}
        />
      )}
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Withdrawable'}
        toolTipContent={`~${Number(formatBN(underlyingWithdrawable, eap.decimals)).toFixed(3)} ${eap.underlyingSymbol}`}
        value={`${sharesWithdrawable.formatted} y${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
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
        <div>
          You will get ~{Number(formatBN(calculateInstantWithdrawal(withdrawalInputBN, eap), eap.decimals)).toFixed(3)}{' '}
          {eap.underlyingSymbol}
        </div>
      </div>
      <Button
        disabled={withdrawalInputBN == 0n || withdrawalErrorMessage !== ''}
        onClick={() => handleInstantWithdrawal(eap.address, withdrawalInputBN, minFromBalance, address)}
      >
        Withdraw
      </Button>
      {eap.isEth && (
        <Button
          disabled={withdrawalInputBN == 0n || withdrawalErrorMessage !== ''}
          onClick={() => handleInstantWithdrawalEth(eap.address, withdrawalInputBN, minFromBalance, address)}
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
