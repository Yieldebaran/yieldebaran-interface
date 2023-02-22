import { CHAIN_LIST, ChainConfig } from 'src/constants/chain';
import { ChainId } from 'src/constants/chainId';

export const getChainConfig = <T extends number>(chainId: T) =>
  CHAIN_LIST[chainId] as T extends ChainId ? ChainConfig : ChainConfig | undefined;
