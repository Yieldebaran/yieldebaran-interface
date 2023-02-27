import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Button from 'src/Components/Button/button';
import Error from 'src/Components/Error/error';
import Footer from 'src/Components/Footer/footer';
import Menu from 'src/Components/Menu/menu';
import TabletMenu from 'src/Components/Menu/tabletMenu';
import { getErrorMessage } from 'src/Connectors/connectors';
import { MetamaskNotFounfError } from 'src/Connectors/metamask-connector';
import {
  XDEFIWalletNotDefaultError,
  XDEFIWalletNotFoundError,
} from 'src/Connectors/xdefi-connector';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

export const Layout = () => {
  const { error, chainId, deactivate } = useWeb3React();
  const { isMobile, isTablet } = useAppearance();
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
      {isTablet || isMobile ? <TabletMenu /> : <Menu />}
      <div className="main-content">
        <Outlet />
      </div>
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
