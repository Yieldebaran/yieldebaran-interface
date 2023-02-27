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

type ChainProviderCtxType = {
  selectedChainId: ChainId | null;
  wSSProvider: WSSProvider;
  setSelectedChainId: Dispatch<SetStateAction<ChainId | null>>;
  chainConfig: ChainConfig | null;
};

const chainProviderInitCtx = {
  selectedChainId: null,
  wSSProvider: null,
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

  const wSSProvider = useMemo(() => {
    if (!selectedChainId) return null;
    log('new wSSProvider created', { selectedChainId });
    const chainConfig = getChainConfig(selectedChainId);
    return new ethers.providers.WebSocketProvider(chainConfig.publicWebSocket);
  }, [selectedChainId]);

  useEffect(() => log('hell', chainConfig), [chainConfig]);

  const ctx = {
    selectedChainId,
    setSelectedChainId,
    wSSProvider,
    chainConfig,
  };

  log('ctx', ctx);

  return <ChainProviderCtx.Provider value={ctx}>{children}</ChainProviderCtx.Provider>;
};

export const useChain = () => useContext(ChainProviderCtx);
