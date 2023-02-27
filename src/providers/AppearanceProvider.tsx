import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme, Theme } from 'src/theme';
import { FCC } from 'src/types/FCC';
import { useWindowSize } from 'usehooks-ts';

type AppearanceProviderCtxType = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  spinnerVisible: boolean;
  setSpinnerVisible: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  isTablet: boolean;
  show: boolean;
  theme: Theme;
  scale: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const AppearanceProviderInitCtx = {
  darkMode: false,
  setDarkMode: () => null,
  spinnerVisible: false,
  setSpinnerVisible: () => null,
  isMobile: false,
  isTablet: false,
  show: false,
  theme: lightTheme,
  scale: false,
  mobileMenuOpen: false,
  setMobileMenuOpen: () => null,
};

const ThemeProviderCtx = createContext<AppearanceProviderCtxType>(AppearanceProviderInitCtx);

export const AppearanceProvider: FCC = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [spinnerVisible, setSpinnerVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(AppearanceProviderInitCtx.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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

  const ctx = {
    darkMode,
    setDarkMode,
    spinnerVisible,
    setSpinnerVisible,
    isMobile,
    isTablet,
    show,
    theme,
    scale,
    mobileMenuOpen,
    setMobileMenuOpen,
  };

  return <ThemeProviderCtx.Provider value={ctx}>{children}</ThemeProviderCtx.Provider>;
};

export const useAppearance = () => useContext(ThemeProviderCtx);
