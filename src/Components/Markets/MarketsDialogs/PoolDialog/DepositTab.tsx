import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';

import { approve, deposit, depositEth } from 'src/Classes/AppState';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

import { bnFromInput, validateInput } from 'src/Utils/numbers';
import { toastError, toastSuccess } from 'src/utils/toast';

import Button from '../../../Button/button';

import TextBox from '../../../Textbox/textBox';
import '../marketDialog.css';
import MarketDialogItem from '../marketDialogItem';

const log = debug('components:DepositTab');

interface Props {
  selectedPool: string;
}
const DepositTab: React.FC<Props> = (props: Props) => {
  const { accountEthBalance, updateAppState, eapStates } = useContractsData();

  const { chainConfig } = useChain();

  const mounted = useRef<boolean>(false);

  const [depositInput, setDepositInput] = useState<string>('');
  const [depositErrorMessage, setDepositErrorMessage] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>(accountEthBalance.formatted);

  const [ethInput, setEthInput] = useState<string>('');
  const [ethErrorMessage, setEthErrorMessage] = useState<string>('');
  const eap = eapStates[props.selectedPool];

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleStakeAmountChange = () => {
      setDepositErrorMessage(validateInput(depositInput, eap.accountUnderlyingBalance.formatted));
    };

    handleStakeAmountChange();
  }, [depositInput]);

  useEffect(() => {
    const handleEthBalance = () => {
      log('handleEthBalance fired', accountEthBalance.formatted);
      setEthBalance(accountEthBalance.formatted);
    };
    handleEthBalance();
  }, [accountEthBalance]);

  useEffect(() => {
    const handleEthAmountChange = () => {
      setEthErrorMessage(validateInput(ethInput, ethBalance));
    };

    handleEthAmountChange();
  }, [ethInput, ethBalance]);

  const setMaxDeposit = (): void => {
    setDepositInput(String(eap.accountUnderlyingBalance.formatted));
  };

  const setMaxEthDeposit = (): void => {
    setEthInput(ethBalance);
  };

  const handleDeposit = async (amount: bigint) => {
    try {
      const tx = await deposit(eap.address, amount);
      if (mounted) setDepositInput('');
      const receipt = await tx.wait();
      log('handleDeposit receipt', receipt);
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

  const handleApprove = async () => {
    try {
      const tx = await approve(eap.underlying, eap.address, 2n ** 256n - 1n);
      const receipt = await tx.wait();
      log('handleApprove receipt', receipt);
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

  const handleDepositEth = async (amount: bigint) => {
    if (!chainConfig) return;
    try {
      const tx = await depositEth(chainConfig.ethAdapter, amount);
      if (mounted) setEthInput('');
      const receipt = await tx.wait();
      log('handleDepositEth receipt', receipt);
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

  const depositBN = bnFromInput(depositInput, eap?.decimals || 0);
  const depositEthBN = bnFromInput(ethInput, eap?.decimals || 0);

  if (!eap || !mounted) return null;

  return (
    <>
      <MarketDialogItem
        title={'Deposited'}
        value={`${eap.accountAllocated.formatted} ${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
      <MarketDialogItem
        title={'Balance'}
        value={`${eap.accountUnderlyingBalance.formatted} ${eap.underlyingSymbol}`}
      />
      <div className="dialog-line" />
      {eap.isEth && (
        <MarketDialogItem
          title={'Native balance'}
          value={`${accountEthBalance.formatted} ${eap.underlyingSymbol.substring(1)}`}
        />
      )}
      <div className="dialog-line" />
      <MarketDialogItem
        toolTipContent={`Performance fee ${eap.performanceFee.formatted}% applied`}
        title={'Current APY'}
        value={eap.apyAfterFee[0].apy + '%'}
      />
      <div className="dialog-line" onClick={() => updateAppState()} />
      <MarketDialogItem
        toolTipContent={`Performance fee ${eap.performanceFee.formatted}% applied`}
        title={'7d APY'}
        value={String(eap.apyAfterFee[1].apy + '%')}
      />
      <div className="dialog-line" />
      <div className="input-group">
        <div className="input-button-group">
          <TextBox
            disabled={eap.accountUnderlyingBalance.native === 0n}
            buttonDisabled={depositBN === eap.accountUnderlyingBalance.native}
            placeholder={eap.underlyingSymbol}
            value={depositInput}
            setInput={setDepositInput}
            validation={depositErrorMessage}
            button={'Max'}
            onClick={() => setMaxDeposit()}
          />
          {eap.accountAllowance.native >= depositBN ? (
            <Button
              disabled={depositInput === '' || depositErrorMessage !== ''}
              loading={false}
              rectangle={true}
              onClick={() => handleDeposit(depositBN)}
            >
              Deposit
            </Button>
          ) : (
            <Button
              rectangle={true}
              loading={false}
              disabled={depositBN === 0n}
              onClick={() => handleApprove()}
            >
              Approve
            </Button>
          )}
        </div>
      </div>
      {eap.isEth && (
        <div className="input-group">
          <div className="input-button-group">
            <TextBox
              disabled={accountEthBalance.native === 0n}
              buttonDisabled={depositEthBN === accountEthBalance.native}
              placeholder={eap.underlyingSymbol.substring(1)}
              value={ethInput}
              setInput={setEthInput}
              validation={ethErrorMessage}
              button={'Max'}
              onClick={() => setMaxEthDeposit()}
            />
            <Button
              loading={false}
              rectangle={true}
              disabled={ethInput === '' || ethErrorMessage !== ''}
              onClick={() => handleDepositEth(depositEthBN)}
            >
              Deposit {eap.underlyingSymbol.substring(1)}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DepositTab;
