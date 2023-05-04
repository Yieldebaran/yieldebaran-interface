import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { approve, deposit, depositEth } from 'src/classes/AppState';

import { Button } from 'src/components/Button/button';
import { InputGroup } from 'src/components/InputGroup';
import { PoolModalRow } from 'src/components/modals/PoolModal/PoolModalRow';
import { useWrongNetworkLabel } from 'src/hooks/useNetworkCheck';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import { UiInput } from 'src/uiKit/UiInput';

import { bnFromInput, validateInput } from 'src/utils/numbers';
import { toastError, toastSuccess } from 'src/utils/toast';

const log = debug('components:DepositTab');

const DepositTab = () => {
  const { poolAddress } = useParams() as { poolAddress: string };
  const { accountEthBalance, updateAppState, eapStates } = useContractsData();
  const wrongLabel = useWrongNetworkLabel();

  const { chainConfig } = useChain();

  const mounted = useRef<boolean>(false);

  const [depositInput, setDepositInput] = useState<string>('');
  const [depositErrorMessage, setDepositErrorMessage] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>(accountEthBalance.formatted);

  const [ethInput, setEthInput] = useState<string>('');
  const [ethErrorMessage, setEthErrorMessage] = useState<string>('');
  const eap = eapStates[poolAddress];

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
  }, [depositInput, eap.accountUnderlyingBalance.formatted]);

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
      <div>
        <PoolModalRow
          title={'Deposited'}
          value={`${eap.accountAllocated.formatted} ${eap.underlyingSymbol}`}
        />
        <div className="dialog-line" />
        <PoolModalRow
          title={'Balance'}
          value={`${eap.accountUnderlyingBalance.formatted} ${eap.underlyingSymbol}`}
        />
        <div className="dialog-line" />
        {eap.isEth && (
          <PoolModalRow
            title={'Native balance'}
            value={`${accountEthBalance.formatted} ${eap.underlyingSymbol.substring(1)}`}
          />
        )}
        <div className="dialog-line" />
        <PoolModalRow
          toolTipContent={`Performance fee ${eap.performanceFee.formatted}% applied`}
          title={'Current APY'}
          value={eap.apyAfterFee[0].apy + '%'}
        />
        <div className="dialog-line" onClick={() => updateAppState()} />
        <PoolModalRow
          toolTipContent={
            eap.apyAfterFee[1]
              ? `Performance fee ${eap.performanceFee.formatted}% applied`
              : undefined
          }
          title={'7d APY'}
          value={
            eap.apyAfterFee[1]
              ? String(eap.apyAfterFee[1].apy + '%')
              : 'no available on this chain yet'
          }
        />
      </div>
      <InputGroup>
        <UiInput
          style={{ flexGrow: 1 }}
          value={depositInput}
          error={depositErrorMessage}
          onChange={(e) => setDepositInput(e.target.value)}
          LeftAdornment={<span>{eap.underlyingSymbol}:</span>}
          RightAdornment={
            <span style={{ cursor: 'pointer' }} onClick={setMaxDeposit}>
              Max
            </span>
          }
        />
        {eap.accountAllowance.native >= depositBN ? (
          <Button
            style={{ minWidth: '140px' }}
            disabled={depositInput === '' || depositErrorMessage !== '' || !!wrongLabel}
            loading={false}
            rectangle={true}
            onClick={() => handleDeposit(depositBN)}
          >
            {wrongLabel || 'Deposit'}
          </Button>
        ) : (
          <Button
            style={{ minWidth: '140px' }}
            rectangle={true}
            loading={false}
            disabled={depositBN === 0n || !!wrongLabel}
            onClick={() => handleApprove()}
          >
            {wrongLabel || 'Approve'}
          </Button>
        )}
      </InputGroup>
      {eap.isEth && (
        <InputGroup>
          <UiInput
            style={{ flexGrow: 1 }}
            value={ethInput}
            error={ethErrorMessage}
            onChange={(e) => setEthInput(e.target.value)}
            LeftAdornment={<span>{eap.underlyingSymbol.substring(1)}:</span>}
            RightAdornment={
              <span style={{ cursor: 'pointer' }} onClick={setMaxEthDeposit}>
                Max
              </span>
            }
          />
          <Button
            style={{ minWidth: '140px' }}
            loading={false}
            rectangle={true}
            disabled={ethInput === '' || ethErrorMessage !== '' || !!wrongLabel}
            onClick={() => handleDepositEth(depositEthBN)}
          >
            {wrongLabel || `Deposit ${eap.underlyingSymbol.substring(1)}`}
          </Button>
        </InputGroup>
      )}
    </>
  );
};

export default DepositTab;
