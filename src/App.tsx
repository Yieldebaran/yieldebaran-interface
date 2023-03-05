import Buffer from 'buffer';

import { useWeb3React } from '@web3-react/core';

import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';
import { Layout } from 'src/components/Layout/Layout';
import { Modals } from 'src/components/modals/Modals';
import { UrlChainIdManager } from 'src/components/UrlChainIdManager';
import { GetConnector } from 'src/connectors/connectors';
import { MetamaskConnector } from 'src/connectors/metamask-connector';
import { xDefiConnector } from 'src/connectors/xdefi-connector';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

import Home from 'src/views/home';
import { PoolAddress } from 'src/views/pools/poolAddress';

import './App.css';

import { XFI } from './connectors/xdefi-connector/declarations';

declare global {
  interface Window {
    ethereum: any;
    xfi?: XFI;
  }
}

global.Buffer = window.Buffer || Buffer.Buffer;

const App: React.FC = () => {
  const { activate } = useWeb3React();
  const { selectedChainId } = useChain();
  const { darkMode } = useAppearance();
  const setModal = useSetModal();
  const [activation, setActivation] = useState(true);

  useEffect(() => {
    const prov = window.localStorage.getItem('yieldebaran-provider');

    if (!prov) {
      setActivation(false);
      return;
    }

    // for getting account from web3React and prevent useless requests
    setTimeout(() => setActivation(false), 200);

    const con = GetConnector(+prov, setModal, selectedChainId);
    if (con instanceof xDefiConnector && window.ethereum && window.ethereum.__XDEFI) activate(con);
    else if (con instanceof MetamaskConnector && window.ethereum && !window.ethereum.__XDEFI)
      activate(con);
    else activate(con);
  }, []);

  if (activation) return null;

  return (
    <div id="app" className={`App scroller ${darkMode ? 'dark' : 'light'}`}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UrlChainIdManager />}>
            <Route path=":chainId">
              <Route index element={<Home />} />
              <Route path="pools">
                <Route index element={<Navigate to="/" replace />} />
                <Route path=":poolAddress" element={<PoolAddress />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <ReactTooltip id="tooltip" />
      <Modals />
      <ToastContainer />
    </div>
  );
};

export default App;
