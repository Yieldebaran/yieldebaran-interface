import { EventFilter } from '@ethersproject/contracts';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

import erc20Abi from '../abi/erc20.json';

let lastBlockProcessed = 0

const EventTracker: React.FC = () => {
  const { chainConfig, wSSProvider } = useChain();
  const { eapStates, updateAppState } = useContractsData();
  const [eaps, setEaps] = useState(Object.keys(eapStates));

  const { account } = useWeb3React();

  const clearSubs = () => {
    console.log('remove listeners');
    wSSProvider?.removeAllListeners();
  };

  useEffect(() => {
    if (!chainConfig || !wSSProvider) {
      return;
    }

    const newEaps = Object.keys(eapStates);
    if (JSON.stringify(newEaps) === JSON.stringify(eaps)) {
      console.log('eaps not changed, so we will NOT resubscribe');
      return;
    } else {
      console.log('new eaps', newEaps);
      setEaps(newEaps);
    }

    clearSubs();
    lastBlockProcessed = 0

    const filters: EventFilter[] = [];

    Object.entries(eapStates).forEach(([address, eap]) => {
      const underlyingContract = new ethers.Contract(eap.underlying, erc20Abi, undefined);
      if (account) {
        filters.push(
          underlyingContract.filters.Transfer(account),
          underlyingContract.filters.Transfer(undefined, account),
          underlyingContract.filters.Approval(account, address),
        );
      }
      filters.push(underlyingContract.filters.Transfer(address));
      filters.push({ address });
    });

    initListeners(filters);
  }, [account, chainConfig, eapStates, wSSProvider]);

  async function initListeners(filters: EventFilter[]) {
    console.log('initListeners', wSSProvider?._wsReady);
    await wSSProvider?._networkPromise;

    filters.forEach((f) => {
      wSSProvider?.on(f, async (data) => {
        console.log(data);
        if (!data) return;
        const blockNum = Number(data.blockNumber)
        if (lastBlockProcessed >= blockNum) {
          console.log(`block already processed. received ${blockNum} synced to ${lastBlockProcessed}` )
          return
        }
        lastBlockProcessed = blockNum
        console.log(
          `received new block ${data.blockNumber}. Updating state`,
        );
        await updateAppState(Number(data.blockNumber));
      });
      // console.log(f);
    });
    // console.log(wSSProvider);
  }

  return <></>;
};

export default EventTracker;
