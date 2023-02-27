import { EventFilter } from '@ethersproject/contracts';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

import erc20Abi from '../abi/erc20.json';

const EventTracker: React.FC = () => {
  const { chainConfig, wSSProvider } = useChain();
  const { eapStates, updateAppState, blockNumber } = useContractsData();
  const [eaps, setEaps] = useState(Object.keys(eapStates));

  const { account } = useWeb3React();

  let lastUpdateBlock = 0;

  const clearSubs = () => {
    console.log('remove listeners');
    wSSProvider?.removeAllListeners();
  };

  useEffect(() => {
    if (!chainConfig || !wSSProvider) {
      lastUpdateBlock = 0;
      return;
    }

    const newEaps = Object.keys(eapStates);
    if (JSON.stringify(newEaps) === JSON.stringify(eaps)) {
      console.log('eaps not changed, so we will NOT resubscribe');
      return;
    } else {
      console.log('new eaps', newEaps);
      setEaps(newEaps);
      lastUpdateBlock = blockNumber;
    }

    clearSubs();

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
        if (data.blockNumber > lastUpdateBlock) {
          console.log(
            `received new block ${data.blockNumber}, prev ${lastUpdateBlock}. Updating state`,
          );
          lastUpdateBlock = data.blockNumber;
          await updateAppState(Number(data.blockNumber));
        }
      });
      console.log(f);
    });
    console.log(wSSProvider);
  }

  return <></>;
};

export default EventTracker;
