import { ethers } from 'ethers';
import { createContext, useContext } from 'react';

import { ChainConfig } from 'src/constants/chain';

export type GlobalContext = {
  network: ChainConfig | null;
  setNetwork: (n: ChainConfig | null) => void;
  webSocketProvider: ethers.providers.WebSocketProvider | undefined;
  setWebSocketProvider: (p: ethers.providers.WebSocketProvider) => void;
  address: string;
  setAddress: (a: string) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  network: null,
  setNetwork: () => undefined,
  webSocketProvider: undefined,
  setWebSocketProvider: () => undefined,
  address: '',
  setAddress: () => undefined,
});

export const useGlobalContext = (): GlobalContext => useContext(MyGlobalContext);
