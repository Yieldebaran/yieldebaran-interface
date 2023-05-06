import { EventFilter } from '@ethersproject/contracts';

import { useWeb3React } from '@web3-react/core';
import debug from 'debug';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useChain } from 'src/providers/ChainProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

import erc20Abi from '../abi/erc20.json';

const log = debug('utils:EventTracker');

let lastBlockUpd = 0

const EventTracker: React.FC = () => {
  const { chainConfig, wssProvider, wssProviderAlt } = useChain();
  const { eapStates, updateAppState } = useContractsData();
  const [eaps, setEaps] = useState(Object.keys(eapStates));

  const { account } = useWeb3React();

  const clearSubs = () => {
    log('remove listeners');
    wssProvider?.removeAllListeners();
    if (wssProviderAlt) {
      wssProviderAlt?.removeAllListeners();
    }
  };

  useEffect(() => {
    if (!chainConfig || !wssProvider) {
      return;
    }

    const newEaps = Object.keys(eapStates);
    if (JSON.stringify(newEaps) === JSON.stringify(eaps)) {
      log('eaps not changed, so we will NOT resubscribe', newEaps, eaps);
      return;
    } else {
      log('new eaps', newEaps);
      setEaps(newEaps);
      lastBlockUpd = 0
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
  }, [account, chainConfig, eapStates, wssProvider]);

  async function initListeners(filters: EventFilter[]) {
    log('initListeners', wssProvider?._wsReady);
    await wssProvider?._networkPromise;
    if (wssProviderAlt) {
      await wssProviderAlt?._networkPromise;
    }

    filters.forEach((f) => {
      wssProvider?.on(f, async (data) => {
        log('main provider event', data);
        if (!data) return;
        if (data.blockNumber > lastBlockUpd) {
          log(`received new block ${data.blockNumber}, prev ${lastBlockUpd}. Updating state`);
          lastBlockUpd = data.blockNumber
          await updateAppState(Number(data.blockNumber));
        } else {
          log('update already processed', data.blockNumber, lastBlockUpd)
        }
      });
      if (wssProviderAlt) {
        log('subscribed to alt provider')
        wssProviderAlt.on(f, async (data) => {
          log('alt provider event', data);
          if (!data) return;
          if (data.blockNumber > lastBlockUpd) {
            log(`received new block ${data.blockNumber}, prev ${lastBlockUpd}. Updating state`);
            lastBlockUpd = data.blockNumber
            await updateAppState(Number(data.blockNumber));
          } else {
            log('update already processed', data.blockNumber, lastBlockUpd)
          }
        });
      }
      // log(f);
    });
    log('subscribed')
    // log(wSSProvider);
  }

  return <></>;
};

export default EventTracker;
