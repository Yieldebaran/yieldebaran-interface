import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from 'src/components/Button/button';
import Error from 'src/components/Error/error';
import { Footer } from 'src/components/Footer/Footer';
import { Header } from 'src/components/Header/Header';
import { StarsBg } from 'src/components/StarsBg/StarsBg';
import { getErrorMessage } from 'src/connectors/connectors';
import { MetamaskNotFounfError } from 'src/connectors/metamask-connector';
import {
  XDEFIWalletNotDefaultError,
  XDEFIWalletNotFoundError,
} from 'src/connectors/xdefi-connector';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';
import styled from 'styled-components';

const MainContent = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 8rem 1rem 0;
  margin: 0 auto;

  @media screen and (max-width: 1100px) {
    padding-top: 4rem;
  }
`;

export const Layout = () => {
  const { error, chainId, deactivate } = useWeb3React();
  const { setSelectedChainId } = useChain();
  const setModal = useSetModal();

  const [showError, setShowError] = useState(false);

  const openSwitchNetwork = () => {
    setShowError(false);
    setModal({ key: 'selectChain' });
  };

  useEffect(() => {
    if (chainId) {
      setSelectedChainId(chainId);
    }
  }, [chainId]);

  useEffect(() => {
    if (!error) return;
    if (String(error).includes('Unsupported chain id')) {
      return;
    }

    setShowError(true);
    deactivate();
  }, [error]);

  return (
    <>
      <StarsBg />
      <Header />
      <MainContent style={{ flexGrow: 1 }}>
        <Outlet />
      </MainContent>
      <Footer />
      {error instanceof UnsupportedChainIdError ? (
        <Error
          open={showError}
          close={() => setShowError(false)}
          errorMessage={getErrorMessage(error)}
          button={
            <Button onClick={() => openSwitchNetwork()}>
              <span>Please Switch</span>
            </Button>
          }
        />
      ) : error instanceof XDEFIWalletNotFoundError ||
        error instanceof XDEFIWalletNotDefaultError ||
        error instanceof MetamaskNotFounfError ? (
        <Error
          open={showError}
          close={() => setShowError(false)}
          errorMessage={getErrorMessage(error)}
        />
      ) : null}
    </>
  );
};
