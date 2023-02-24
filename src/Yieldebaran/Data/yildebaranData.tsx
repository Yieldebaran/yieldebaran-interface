import { useWeb3React } from '@web3-react/core';
import debug from 'debug';

import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { EapData, loadAppState } from 'src/Classes/AppState';
import { FVal } from 'src/Types/appDataContext';

import { useGlobalContext } from 'src/Types/globalContext';

const log = debug('hooks:useFetchData');

const useFetchData = () => {
  const networkId = useRef<number>();

  const selectedPoolRef = useRef<string>();
  const accountRef = useRef<string | null | undefined>();

  const [eapStates, setEapStates] = useState<{ [eap: string]: EapData }>({});
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);
  const [accountEthBalance, setAccountEthBalance] = useState<FVal>({
    native: 0n,
    formatted: '0.0',
  });
  const [selectedPool, setSelectedPool] = useState<string>();

  const { network } = useGlobalContext();
  const { library, account, chainId } = useWeb3React();

  useEffect(() => {
    selectedPoolRef.current = selectedPool;
  }, [selectedPool]);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    setEapStates({});
    setBlockNumber(0);
    setBlockTimestamp(0);
    setAccountEthBalance({ native: 0n, formatted: '0.0' });
    setSelectedPool(undefined);
    if (!network) return;
    if (!chainId) {
      networkId.current = { ...network }.chainId;
      fetchAppState();
      return;
    }
    if (account && library && network.chainId === chainId) {
      networkId.current = { ...network }.chainId;
      fetchAppState();
      return;
    }
  }, [library, network, account]);

  const fetchAppState = async (blockNumber?: number) => {
    log('updating app data');
    if (network) {
      const net = { ...network };
      const appState = await loadAppState(
        library || new ethers.providers.JsonRpcProvider(net.publicRpc),
        net,
        account as string,
        blockNumber,
      );
      setEapStates(appState.states);
      setBlockTimestamp(appState.blockTimestamp);
      setBlockNumber(appState.blockNumber);
      setAccountEthBalance(appState.accountEthBalance);
      log('app data updated', {
        blockNumber: appState.blockNumber,
        accountEthBalance: appState.accountEthBalance,
        states: appState.states,
      });
    }
  };

  const updateAppState = async (blockNumber?: number): Promise<void> => {
    await fetchAppState(blockNumber);
  };

  return {
    selectedPool,
    setSelectedPool,
    updateAppState,
    blockTimestamp,
    blockNumber,
    eapStates,
    accountEthBalance,
  };
};

export default useFetchData;
