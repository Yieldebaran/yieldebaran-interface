import React, { useState, useEffect } from 'react'
import {lightTheme, darkTheme, Theme} from './theme'
import './App.css';
import { Network } from './networks'
import Spinner from './Components/Spinner/spinner';
import ReactTooltip from 'react-tooltip'
import 'react-toastify/dist/ReactToastify.css'
import Buffer from "buffer"
import { MyUiContext } from './Types/uiContext';
import { MyGlobalContext } from './Types/globalContext';
import { XFI } from './Connectors/xdefi-connector/declarations';
import Home from 'src/Yieldebaran/Views/home';
import { toast, ToastContainer } from 'react-toastify';
import {useWindowSize} from 'usehooks-ts'
import {ethers} from "ethers";

declare global {
  interface Window {
    ethereum: any
    xfi?: XFI
  }
}

global.Buffer = window.Buffer || Buffer.Buffer

const App: React.FC = () => {
  const [address, setAddress] = useState<string>("")


  const [network, setNetwork] = useState<Network | null>(null)
  const [webSocketProvider, setWebSocketProvider] = useState<ethers.providers.WebSocketProvider | undefined>(undefined)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [spinnerVisible, setSpinnerVisible] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [showWallets, setShowWallets] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [accountOpen, setAccountOpen] = useState<boolean>(false)

  const [openAddress, setOpenAddress] = useState<boolean>(false)
  const [openNetwork, setOpenNetwork] = useState<boolean>(false)
  const [switchModal, setSwitchModal] = useState(false)
  const [scale, setScale] = useState(false)

  const { width } = useWindowSize()

  useEffect(() => {
    setShow(true)

    const darkmode = window.localStorage.getItem("yieldebaran-darkmode")

    if(darkmode && darkmode === "dark")
      setDarkMode(true)
    else
      setDarkMode(false)
  }, [])

  useEffect(() => {
    if(show){
      if (width < 925) {
        setIsMobile(true)
        setIsTablet(false)
      }
      else if (width < 1325) {
        console.log("Tablet")
        setScale(false)
        setIsTablet(true)
        setIsMobile(false)
      }
      else {
          setIsTablet(false)
      }
    }
  }, [width, show])

  useEffect(() => {
    if (darkMode) {
      window.localStorage.setItem("yieldebaran-darkmode", "dark")
      setTheme(darkTheme)
    } else {
      window.localStorage.setItem("yieldebaran-darkmode", "light")
      setTheme(lightTheme)
    }
  }, [darkMode])

  const toastError = (error: string, autoClose = true, closeDelay = 10000) => {
    toast.error(error, {
      position: "top-right",
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: autoClose ? false : true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true,
      });
  }

  const toastSuccess = (message: string, autoClose = true, closeDelay = 10000) => {
    toast.success(message, {
      position: "top-right",
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: autoClose ? false : true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true
      });
  }

  return (
    theme ?
    <MyGlobalContext.Provider value={({
        network, setNetwork, address, setAddress, setWebSocketProvider, webSocketProvider
    })}>
        <MyUiContext.Provider value={({
            darkMode, setDarkMode,
            spinnerVisible, setSpinnerVisible,
            isMobile, setIsMobile,
            isTablet, setIsTablet,
            show, setShow,
            theme, setTheme,
            openAddress, setOpenAddress,
            openNetwork, setOpenNetwork,
            toastSuccessMessage: toastSuccess,
            toastErrorMessage: toastError,
            switchModal, setSwitchModal,
            scale, setScale,
            showWallets, setShowWallets,
            mobileMenuOpen, setMobileMenuOpen,
            accountOpen, setAccountOpen
        })}>
          <div id="app" className={`App scroller ${darkMode ? "dark" : "light"}`}>
            <Home/>
            <ReactTooltip id="tooltip"/>
            <Spinner/>
          </div>
          <ToastContainer/>
        </MyUiContext.Provider>
    </MyGlobalContext.Provider>
    : <div className="App">
      </div>
  )
}

export default App;
