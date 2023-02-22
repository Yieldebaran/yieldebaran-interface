import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import Account from 'src/Components/Account/account';
import Button from 'src/Components/Button/button';
import Error from 'src/Components/Error/error';
import Footer from 'src/Components/Footer/footer';
import Menu from 'src/Components/Menu/menu';
import TabletMenu from 'src/Components/Menu/tabletMenu';
import YieldebaranMessage from 'src/Components/MessageDialog/messageDialog';
import NetworksMenu from 'src/Components/NetworksMenu/networksMenu';
import Wallets from 'src/Components/Wallets/wallets';
import { GetConnector, getErrorMessage } from 'src/Connectors/connectors';
import { MetamaskConnector, MetamaskNotFounfError } from 'src/Connectors/metamask-connector';
import {
  xDefiConnector,
  XDEFIWalletNotDefaultError,
  XDEFIWalletNotFoundError,
} from 'src/Connectors/xdefi-connector';
import NETWORKS, { Network } from 'src/networks';
import { YieldebaranDataContext } from 'src/Types/appDataContext';
import { useGlobalContext } from 'src/Types/globalContext';
import { useUiContext } from 'src/Types/uiContext';
import yieldebaranData from 'src/Yieldebaran/Data/yildebaranData';

export const Layout = () => {
  const { activate, error, chainId, account, deactivate } = useWeb3React();
  const { darkMode, setOpenNetwork, isMobile, isTablet } = useUiContext();
  const { network, setNetwork, setAddress, setWebSocketProvider } = useGlobalContext();

  const [showError, setShowError] = useState(false);

  const [showGMessage, setShowGMessage] = useState<boolean>(false);
  const [gMessageText, setGMessageText] = useState<JSX.Element>();

  const openSwitchNetwork = () => {
    setShowError(false);
    setOpenNetwork(true);
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
      // console.log('net', net);
      // console.log('hello223 no network detected, open network modal');
      setOpenNetwork(true);
    }

    let tempNet: Network | null = null;

    if (net) tempNet = JSON.parse(net) as Network;

    if (prov) {
      const con = GetConnector(+prov, setOpenNetwork, tempNet ? tempNet.chainId : undefined);
      if (con instanceof xDefiConnector && window.ethereum && window.ethereum.__XDEFI)
        activate(con);
      else if (con instanceof MetamaskConnector && window.ethereum && !window.ethereum.__XDEFI)
        activate(con);
      else activate(con);
    }

    //setSpinnerVisible(false)
  }, []);

  useEffect(() => {
    // console.log('yieldebaran-network set', network);
    window.localStorage.setItem('yieldebaran-network', JSON.stringify(network));
  }, [network]);

  useEffect(() => {
    if (chainId) {
      const net = NETWORKS[chainId];
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
      // setOpenNetwork(true)
      return;
    }
    console.log(error);
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
          <NetworksMenu />
          <Outlet />
        </div>
        <Footer />
        <YieldebaranMessage
          isOpen={showGMessage}
          onRequestClose={() => setShowGMessage(false)}
          contentLabel="Info"
          className={`${darkMode ? 'mymodal-dark' : ''}`}
          message={gMessageText}
        />
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
