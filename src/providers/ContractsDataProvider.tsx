import { useWeb3React } from '@web3-react/core';
import debug from 'debug';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EapData, loadAppState, setSigner } from 'src/classes/AppState';
import { ChainId } from 'src/constants/chain';
import { useChain } from 'src/providers/ChainProvider';
import { FVal } from 'src/types/appDataContext';
import { FCC } from 'src/types/FCC';

const log = debug('providers:ContractsDataProvider');

type ContractsDataProviderCtxType = {
  selectedPool: string;
  setSelectedPool: Dispatch<SetStateAction<string>>;
  updateAppState: (blockNumber?: number) => Promise<void>;
  blockTimestamp: number;
  blockNumber: number;
  eapStates: Record<string, EapData>;
  accountEthBalance: FVal;
  eap: EapData | null;
  fetching: boolean;
};

const ContractsDataProviderInitCtx = {
  selectedPool: '',
  setSelectedPool: () => null,
  updateAppState: async () => undefined,
  blockTimestamp: 0,
  blockNumber: 0,
  eapStates: {},
  accountEthBalance: {
    native: 0n,
    formatted: '0.0',
  },
  eap: null,
  fetching: true,
};

let prevChain: ChainId;
let prevAccount: string | null | undefined;

let lastRequestId: string;

export const ContractsDataProvider: FCC = ({ children }) => {
  const { chainConfig, httpProvider, selectedChainId } = useChain();
  const { account, library } = useWeb3React();

  const [fetching, setFetching] = useState(false);
  const [eapStates, setEapStates] = useState<Record<string, EapData>>({});
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);
  const [accountEthBalance, setAccountEthBalance] = useState<FVal>({
    native: 0n,
    formatted: '0.0',
  });
  const [selectedPool, setSelectedPool] = useState<string>('');

  useEffect(() => {
    if (!chainConfig || !httpProvider || !selectedChainId) return;
    if (selectedChainId === prevChain && account === prevAccount) return;

    log('initializing state', selectedChainId, prevChain, account, prevAccount);
    prevChain = selectedChainId;
    prevAccount = account;

    lastRequestId = selectedChainId + String(account);

    setFetching(true);
    fetchAppState(undefined, lastRequestId);
  }, [chainConfig, account, selectedChainId, httpProvider]);

  const eap = useMemo(() => eapStates[selectedPool], [selectedPool, eapStates]);

  async function fetchAppState(blockNumber?: number, requestId?: string) {
    log('fetchAppState fired', {
      chainConfig,
      requestId,
      account,
      selectedChainId,
      prevChain: prevChain,
      prevAccount: prevAccount,
    });
    if (chainConfig) {
      const net = { ...chainConfig };
      // console.log('fetchAppState', blockNumber)
      const appState = await loadAppState(httpProvider, net, account as string, blockNumber);
      if (requestId !== undefined && requestId !== lastRequestId) {
        log('skipped old update request', requestId);
        return;
      }

      setSigner(library || httpProvider);
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
    setFetching(false);
  }

  return (
    <ContractsDataProviderCtx.Provider
      value={{
        selectedPool,
        setSelectedPool,
        updateAppState: fetchAppState,
        blockTimestamp,
        blockNumber,
        eapStates,
        accountEthBalance,
        eap,
        fetching,
      }}
    >
      {children}
    </ContractsDataProviderCtx.Provider>
  );
};
const ContractsDataProviderCtx = createContext<ContractsDataProviderCtxType>(
  ContractsDataProviderInitCtx,
);

export const useContractsData = () => useContext(ContractsDataProviderCtx);
