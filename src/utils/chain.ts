import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { CHAIN_LIST, ChainConfig, ChainId } from 'src/constants/chain';

export const getChainConfig = <T extends number>(chainId: T) =>
  CHAIN_LIST[chainId] as T extends ChainId ? ChainConfig : ChainConfig | undefined;

export const isChainSupported = (chainId: number | undefined) => {
  if (!chainId) return false;
  return Object.keys(CHAIN_LIST).includes(String(chainId));
};

export const checkWeb3Network = (
  { account, chainId }: Web3ReactContextInterface,
  chainConfig: ChainConfig | null,
) => ({
  isConnected: Boolean(account),
  isSupported: isChainSupported(chainId),
  networksMatch: !chainConfig || chainConfig.chainId === chainId,
});
