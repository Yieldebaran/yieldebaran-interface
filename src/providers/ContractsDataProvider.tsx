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
import { EapData, loadAppState } from 'src/classes/AppState';
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
};

let prevChain: ChainId;
let prevAccount: string | null | undefined;

export const ContractsDataProvider: FCC = ({ children }) => {
  const { chainConfig, wSSProvider, selectedChainId } = useChain();
  const { account, library } = useWeb3React();

  const [eapStates, setEapStates] = useState<Record<string, EapData>>({});
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);
  const [accountEthBalance, setAccountEthBalance] = useState<FVal>({
    native: 0n,
    formatted: '0.0',
  });
  const [selectedPool, setSelectedPool] = useState<string>('');

  useEffect(() => {
    if (!chainConfig || !wSSProvider || !selectedChainId) return;
    if (selectedChainId === prevChain && account === prevAccount) return;

    prevChain = selectedChainId;
    prevAccount = account;

    fetchAppState();
  }, [chainConfig, account, selectedChainId, wSSProvider]);

  const eap = useMemo(() => eapStates[selectedPool], [selectedPool, eapStates]);

  async function fetchAppState(blockNumber?: number) {
    log('fetchAppState fired', {
      chainConfig,
      account,
      selectedChainId,
      prevChain: prevChain,
      prevAccount: prevAccount,
    });
    if (chainConfig) {
      const net = { ...chainConfig };
      const appState = await loadAppState(
        library || wSSProvider,
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
