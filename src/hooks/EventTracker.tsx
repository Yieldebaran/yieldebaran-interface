import { EventFilter } from '@ethersproject/contracts';

import { useWeb3React } from '@web3-react/core';
import debug from 'debug';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

import erc20Abi from '../abi/erc20.json';

const log = debug('utils:EventTracker');

const EventTracker: React.FC = () => {
  const { chainConfig, wSSProvider } = useChain();
  const { eapStates, updateAppState, blockNumber } = useContractsData();
  const [eaps, setEaps] = useState(Object.keys(eapStates));
  const [lastUpdateBlock, setLastUpdateBlock] = useState(0);

  const { account } = useWeb3React();

  const clearSubs = () => {
    log('remove listeners');
    wSSProvider?.removeAllListeners();
  };

  useEffect(() => {
    if (!chainConfig || !wSSProvider) {
      setLastUpdateBlock(0);
      return;
    }

    const newEaps = Object.keys(eapStates);
    if (JSON.stringify(newEaps) === JSON.stringify(eaps)) {
      log('eaps not changed, so we will NOT resubscribe');
      return;
    } else {
      log('new eaps', newEaps);
      setEaps(newEaps);
      setLastUpdateBlock(blockNumber);
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
    log('initListeners', wSSProvider?._wsReady);
    await wSSProvider?._networkPromise;

    filters.forEach((f) => {
      wSSProvider?.on(f, async (data) => {
        log(data);
        if (!data) return;
        if (data.blockNumber > lastUpdateBlock) {
          log(`received new block ${data.blockNumber}, prev ${lastUpdateBlock}. Updating state`);
          setLastUpdateBlock(data.blockNumber);
          await updateAppState(Number(data.blockNumber));
        }
      });
      // log(f);
    });
    // log(wSSProvider);
  }

  return <></>;
};

export default EventTracker;
