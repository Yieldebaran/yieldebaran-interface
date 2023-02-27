import React, { useEffect } from 'react';
import { NavigateFunction, Outlet, useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_CHAIN } from 'src/constants/chain';
import { useChain } from 'src/providers/ChainProvider';
import { getChainConfig } from 'src/utils/chain';

function navigateToDefaultChain(navigate: NavigateFunction) {
  const validChainId = getChainConfig(DEFAULT_CHAIN).chainId;
  navigate(`/${validChainId}`);
}

export const UrlChainIdManager: React.FC = () => {
  const { setSelectedChainId } = useChain();
  const { chainId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chainId) {
      navigateToDefaultChain(navigate);
      return;
    }

    const chainConfig = getChainConfig(Number(chainId));

    if (!chainConfig) {
      navigateToDefaultChain(navigate);
      return;
    }

    setSelectedChainId(chainConfig.chainId);
  }, [chainId, setSelectedChainId, navigate]);

  return <Outlet />;
};
