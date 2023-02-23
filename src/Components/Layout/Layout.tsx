import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Account from 'src/Components/Account/account';
import Button from 'src/Components/Button/button';
import Error from 'src/Components/Error/error';
import Footer from 'src/Components/Footer/footer';
import Menu from 'src/Components/Menu/menu';
import TabletMenu from 'src/Components/Menu/tabletMenu';
import Wallets from 'src/Components/Wallets/wallets';
import { GetConnector, getErrorMessage } from 'src/Connectors/connectors';
import { MetamaskConnector, MetamaskNotFounfError } from 'src/Connectors/metamask-connector';
import {
  xDefiConnector,
  XDEFIWalletNotDefaultError,
  XDEFIWalletNotFoundError,
} from 'src/Connectors/xdefi-connector';
import { ChainConfig } from 'src/constants/chain';
import { useSetModal } from 'src/providers/StoreProvider';
import { YieldebaranDataContext } from 'src/Types/appDataContext';
import { useGlobalContext } from 'src/Types/globalContext';
import { useUiContext } from 'src/Types/uiContext';
import { getChainConfig } from 'src/utils/chain';
import yieldebaranData from 'src/Yieldebaran/Data/yildebaranData';

export const Layout = () => {
  const { activate, error, chainId, account, deactivate } = useWeb3React();
  const { isMobile, isTablet } = useUiContext();
  const { network, setNetwork, setAddress, setWebSocketProvider } = useGlobalContext();
  const setModal = useSetModal();

  const [showError, setShowError] = useState(false);

  const openSwitchNetwork = () => {
    setShowError(false);
    setModal({ key: 'selectChain' });
  };

  useEffect(() => {
    return () => console.log('Unmounted');
  }, [network, account]);

  const {
    selectedPool,
    setSelectedPool,
    updateAppState,
    blockTimestamp,
    blockNumber,
    eapStates,
    accountEthBalance,
  } = yieldebaranData();

  useEffect(() => {
    // console.log('renderdf');
  }, []);

  useEffect(() => {
    const net = window.localStorage.getItem('yieldebaran-network');
    const prov = window.localStorage.getItem('yieldebaran-provider');
    // console.log('net', net);

    if (!net || net === 'null') {
      setModal({ key: 'selectChain' });
    }

    let tempNet: ChainConfig | null = null;

    if (net) tempNet = JSON.parse(net) as ChainConfig;

    if (prov) {
      const con = GetConnector(+prov, setModal, tempNet ? tempNet.chainId : undefined);
      if (con instanceof xDefiConnector && window.ethereum && window.ethereum.__XDEFI)
        activate(con);
      else if (con instanceof MetamaskConnector && window.ethereum && !window.ethereum.__XDEFI)
        activate(con);
      else activate(con);
    }
  }, []);

  useEffect(() => {
    // console.log('yieldebaran-network set', network);
    window.localStorage.setItem('yieldebaran-network', JSON.stringify(network));
  }, [network]);

  useEffect(() => {
    if (chainId) {
      const net = getChainConfig(chainId);
      if (net) {
        setNetwork(net);
        setWebSocketProvider(new ethers.providers.WebSocketProvider(net.publicWebSocket));
        return;
      }
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

  useEffect(() => {
    if (account) setAddress(account);
    else if (!error) setAddress('');
  }, [account]);

  return (
    <YieldebaranDataContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        updateAppState,
        blockTimestamp,
        blockNumber,
        eapStates,
        accountEthBalance,
      }}
    >
      <>
        {!isTablet && !isMobile ? <Menu /> : <TabletMenu />}
        <div className="main-content">
          <Wallets />
          <Account />
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
    </YieldebaranDataContext.Provider>
  );
};
