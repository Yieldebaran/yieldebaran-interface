import { useWeb3React } from '@web3-react/core';
import { useChain } from 'src/providers/ChainProvider';
import { checkWeb3Network } from 'src/utils/chain';

export const useNetworkCheck = () => {
  const web3ReactCtx = useWeb3React();
  const { chainConfig } = useChain();

  return checkWeb3Network(web3ReactCtx, chainConfig);
};

export const useWrongNetworkLabel = () => {
  const { isConnected, isSupported, networksMatch } = useNetworkCheck();
  if (!isConnected) return 'Wallet not connected';
  if (!isSupported) return 'Unsupported network';
  if (!networksMatch) return 'Networks do not match';
  return null;
};
