import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {useGlobalContext} from "../Types/globalContext";

import erc20Abi from '../abi/erc20.json';
import {useYieldebaranDataContext} from "../Types/appDataContext";
import {useWeb3React} from "@web3-react/core";
import {EventFilter} from "@ethersproject/contracts";

export const EventTracker: React.FC = () => {
  const {network, webSocketProvider} = useGlobalContext();
  const {appState, updateAppState} = useYieldebaranDataContext();
  const [eaps, setEaps] = useState(appState.states.map(x => x.address));

  const {account} = useWeb3React();

  let lastUpdateBlock = 0

  const clearSubs = () => {
    console.log('remove listeners');
    webSocketProvider?.removeAllListeners()
  };

  useEffect(() => {
    if (!network || !webSocketProvider) {
      lastUpdateBlock = 0
      return;
    }

    const newEaps = appState.states.map(x => x.address);
    if (JSON.stringify(newEaps) === JSON.stringify(eaps)) {
      return
    } else {
      setEaps(newEaps)
      lastUpdateBlock = appState.blockNumber
    }

    clearSubs();

    const filters: EventFilter[] = []

    appState.states.forEach(eap => {
      const underlyingContract = new ethers.Contract(eap.underlying, erc20Abi, undefined);
      if (account) {
        filters.push(
            underlyingContract.filters.Transfer(account),
            underlyingContract.filters.Transfer(undefined, account)
        )
      }
      filters.push(underlyingContract.filters.Transfer(eap.address))
      filters.push({ address: eap.address })
    })

    initListeners(filters)
  }, [account, network, appState, webSocketProvider]);


  async function initListeners(filters: EventFilter[]) {
    console.log('initListeners', webSocketProvider?._wsReady)
    await webSocketProvider?._networkPromise

    filters.forEach(f => {
      webSocketProvider?.on(f, async data => {
        console.log(data)
        if (!data) return
        if (data.blockNumber > lastUpdateBlock) {
          lastUpdateBlock = data.blockNumber
          console.log(`last block set to ${data.blockNumber}`)
          await updateAppState()
        }
      })
      console.log(f)
    })
    console.log(webSocketProvider)
  }

  return <></>;
}

export default EventTracker