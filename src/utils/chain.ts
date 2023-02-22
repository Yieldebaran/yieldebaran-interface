import { CHAIN_LIST, ChainConfig, ChainId } from 'src/constants/chain';

export const getChainConfig = <T extends number>(chainId: T) =>
  CHAIN_LIST[chainId] as T extends ChainId ? ChainConfig : ChainConfig | undefined;
