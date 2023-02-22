import Buffer from 'buffer';

import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';
import { Layout } from 'src/Components/Layout/Layout';

import Home from 'src/views/home';
import { PoolAddress } from 'src/views/pools/poolAddress';

import { useWindowSize } from 'usehooks-ts';

import './App.css';

import Spinner from './Components/Spinner/spinner';
import { XFI } from './Connectors/xdefi-connector/declarations';
import { Network } from './networks';
import { darkTheme, lightTheme, Theme } from './theme';
import { MyGlobalContext } from './Types/globalContext';

import { MyUiContext } from './Types/uiContext';

declare global {
  interface Window {
    ethereum: any;
    xfi?: XFI;
  }
}

global.Buffer = window.Buffer || Buffer.Buffer;

const App: React.FC = () => {
  const [address, setAddress] = useState<string>('');

  const [network, setNetwork] = useState<Network | null>(null);
  const [webSocketProvider, setWebSocketProvider] = useState<
    ethers.providers.WebSocketProvider | undefined
  >(undefined);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [spinnerVisible, setSpinnerVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [showWallets, setShowWallets] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const [openAddress, setOpenAddress] = useState<boolean>(false);
  const [openNetwork, setOpenNetwork] = useState<boolean>(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [scale, setScale] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    setShow(true);

    const darkmode = window.localStorage.getItem('yieldebaran-darkmode');

    if (darkmode && darkmode === 'dark') setDarkMode(true);
    else setDarkMode(false);
  }, []);

  useEffect(() => {
    if (show) {
      if (width < 925) {
        setIsMobile(true);
        setIsTablet(false);
      } else if (width < 1325) {
        console.log('Tablet');
        setScale(false);
        setIsTablet(true);
        setIsMobile(false);
      } else {
        setIsTablet(false);
      }
    }
  }, [width, show]);

  useEffect(() => {
    if (darkMode) {
      window.localStorage.setItem('yieldebaran-darkmode', 'dark');
      setTheme(darkTheme);
    } else {
      window.localStorage.setItem('yieldebaran-darkmode', 'light');
      setTheme(lightTheme);
    }
  }, [darkMode]);

  const toastError = (error: string, autoClose = true, closeDelay = 10000) => {
    toast.error(error, {
      position: 'top-right',
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: autoClose,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true,
    });
  };

  const toastSuccess = (message: string, autoClose = true, closeDelay = 10000) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: !autoClose,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true,
    });
  };

  return (
    <div id="app" className={`App scroller ${darkMode ? 'dark' : 'light'}`}>
      <MyGlobalContext.Provider
        value={{
          network,
          setNetwork,
          address,
          setAddress,
          setWebSocketProvider,
          webSocketProvider,
        }}
      >
        <MyUiContext.Provider
          value={{
            darkMode,
            setDarkMode,
            spinnerVisible,
            setSpinnerVisible,
            isMobile,
            setIsMobile,
            isTablet,
            setIsTablet,
            show,
            setShow,
            theme,
            setTheme,
            openAddress,
            setOpenAddress,
            openNetwork,
            setOpenNetwork,
            toastSuccessMessage: toastSuccess,
            toastErrorMessage: toastError,
            switchModal,
            setSwitchModal,
            scale,
            setScale,
            showWallets,
            setShowWallets,
            mobileMenuOpen,
            setMobileMenuOpen,
            accountOpen,
            setAccountOpen,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/pools">
                  <Route index element={<Navigate to="/" replace />} />
                  <Route path=":poolAddress" element={<PoolAddress />} />
                </Route>
              </Route>
            </Routes>
            <ReactTooltip id="tooltip" />
            <Spinner />
          </BrowserRouter>
          <ToastContainer />
        </MyUiContext.Provider>
      </MyGlobalContext.Provider>
    </div>
  );
};

export default App;
