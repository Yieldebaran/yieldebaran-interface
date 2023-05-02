import debug from 'debug';
import { ethers } from 'ethers';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChainConfig, ChainId } from 'src/constants/chain';
import { FCC } from 'src/types/FCC';
import { getChainConfig } from 'src/utils/chain';

const log = debug('providers:ChainProvider');

type WSSProvider = ethers.providers.WebSocketProvider | null;
type HTTPProvider = ethers.providers.JsonRpcProvider | null;

type ChainProviderCtxType = {
  selectedChainId: ChainId | null;
  wssProvider: WSSProvider;
  httpProvider: HTTPProvider;
  setSelectedChainId: Dispatch<SetStateAction<ChainId | null>>;
  chainConfig: ChainConfig | null;
};

const chainProviderInitCtx = {
  selectedChainId: null,
  wssProvider: null,
  httpProvider: null,
  chainConfig: null,
  setSelectedChainId: () => null,
};

const ChainProviderCtx = createContext<ChainProviderCtxType>(chainProviderInitCtx);

export const ChainProvider: FCC = ({ children }) => {
  const [selectedChainId, setSelectedChainId] = useState<ChainId | null>(null);
  const chainConfig = useMemo(
    () => (selectedChainId ? getChainConfig(selectedChainId) : null),
    [selectedChainId],
  );

  const wssProvider = useMemo(() => {
    if (!selectedChainId) return null;
    log('new wssProvider created', { selectedChainId });
    const chainConfig = getChainConfig(selectedChainId);
    return new ethers.providers.WebSocketProvider(chainConfig.publicWebSocket);
  }, [selectedChainId]);

  const httpProvider = useMemo(() => {
    if (!selectedChainId) return null;
    log('new httpProvider created', { selectedChainId });
    const chainConfig = getChainConfig(selectedChainId);
    return new ethers.providers.JsonRpcProvider(chainConfig.publicRpc);
  }, [selectedChainId]);

  useEffect(() => log('hello', chainConfig), [chainConfig]);

  const ctx = {
    selectedChainId,
    setSelectedChainId,
    wssProvider,
    httpProvider,
    chainConfig,
  };

  log('ctx', ctx);

  return <ChainProviderCtx.Provider value={ctx}>{children}</ChainProviderCtx.Provider>;
};

export const useChain = () => useContext(ChainProviderCtx);
