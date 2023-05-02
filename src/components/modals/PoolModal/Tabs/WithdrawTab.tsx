import { useWeb3React } from '@web3-react/core';
import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  cancelRequest,
  claimWithdrawal,
  claimWithdrawalEth,
  freeInstantWithdrawal,
  freeInstantWithdrawalEth,
  requestWithdrawal,
} from 'src/classes/AppState';
import { AttentionBlock } from 'src/components/AttentionBlock';
import { Button } from 'src/components/Button/button';
import { InputGroup } from 'src/components/InputGroup';
import { PoolModalRow } from 'src/components/modals/PoolModal/PoolModalRow';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import { UiInput } from 'src/uiKit/UiInput';
import { bnFromInput, formatBN, validateInput } from 'src/utils/numbers';
import { toastError, toastSuccess } from 'src/utils/toast';
import { ONE } from 'src/Yieldebaran/Data/fetchEapsData';

const log = debug('components:WithdrawTab');

const WithdrawTab = () => {
  const { poolAddress } = useParams() as { poolAddress: string };
  const { eapStates, blockTimestamp } = useContractsData();
  const { account } = useWeb3React();

  const mounted = useRef<boolean>(false);

  const eap = eapStates[poolAddress];

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
      const tx = await requestWithdrawal(eap.address, amount, account);
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
      <AttentionBlock>¡ This is a delayed withdrawal, it may take up to 48h !</AttentionBlock>
      <div>
        <PoolModalRow
          title={'Shares balance'}
          toolTipContent={`~${Number(eap.accountAllocated.formatted).toFixed(3)} ${
            eap.underlyingSymbol
          }`}
          value={`${eap.accountShares.formatted} y${eap.underlyingSymbol}`}
        />
        <div className="dialog-line" />
        <PoolModalRow
          title={'Requested amount'}
          value={`${eap.accountUnderlyingRequested.formatted} ${eap.underlyingSymbol}`}
        />
        <div className="dialog-line" />
        <PoolModalRow
          title={'Available to withdraw'}
          value={`${
            eap.lastFulfillmentIndex > eap.accountRequestIndex + 1
              ? eap.accountUnderlyingRequested.formatted
              : 0
          } ${eap.underlyingSymbol}`}
        />
      </div>
      {!isRequested && (
        <>
          <InputGroup>
            <UiInput
              style={{ flexGrow: 1 }}
              value={withdrawalInput}
              onChange={(e) => setWithdrawalInput(e.target.value)}
              LeftAdornment={<span>y{eap.underlyingSymbol}:</span>}
              RightAdornment={
                <span style={{ cursor: 'pointer' }} onClick={setMaxWithdrawal}>
                  Max
                </span>
              }
            />
            <Button
              style={{ width: '140px' }}
              disabled={withdrawalInput === '' || withdrawalErrorMessage !== ''}
              loading={false}
              rectangle={true}
              onClick={() => handleRequestWithdrawal(withdrawalInputBN)}
            >
              Withdraw
            </Button>
          </InputGroup>
          <div style={{ marginTop: '1rem' }}>
            ~
            {Number(formatBN((withdrawalInputBN * eap.exchangeRate) / ONE, eap.decimals)).toFixed(
              3,
            )}{' '}
            {eap.underlyingSymbol}
          </div>
        </>
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
