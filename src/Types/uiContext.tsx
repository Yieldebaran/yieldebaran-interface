import { createContext, useContext } from 'react';

import { lightTheme, Theme } from '../theme';

export type UiContext = {
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  spinnerVisible: boolean;
  setSpinnerVisible: (v: boolean) => void;
  isMobile: boolean;
  setIsMobile: (m: boolean) => void;
  isTablet: boolean;
  setIsTablet: (t: boolean) => void;
  show: boolean;
  setShow: (s: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  openAddress: boolean;
  setOpenAddress: (a: boolean) => void;
  openNetwork: boolean;
  setOpenNetwork: (n: boolean) => void;
  toastSuccessMessage: (m: string, autoClose?: boolean, closeDelay?: number) => void;
  toastErrorMessage: (message: string, autoClose?: boolean, closeDelay?: number) => void;
  switchModal: boolean;
  setSwitchModal: (m: boolean) => void;
  scale: boolean;
  setScale: (h: boolean) => void;
  showWallets: boolean;
  setShowWallets: (w: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (m: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (a: boolean) => void;
};

export const MyUiContext = createContext<UiContext>({
  darkMode: false,
  setDarkMode: () => undefined,
  spinnerVisible: false,
  setSpinnerVisible: () => undefined,
  isMobile: false,
  setIsMobile: () => undefined,
  isTablet: false,
  setIsTablet: () => undefined,
  show: false,
  setShow: () => undefined,
  theme: lightTheme,
  setTheme: () => undefined,
  openAddress: false,
  setOpenAddress: () => undefined,
  openNetwork: false,
  setOpenNetwork: () => undefined,
  toastSuccessMessage: () => undefined,
  toastErrorMessage: () => undefined,
  switchModal: false,
  setSwitchModal: () => undefined,
  scale: false,
  setScale: () => undefined,
  showWallets: false,
  setShowWallets: () => undefined,
  mobileMenuOpen: false,
  setMobileMenuOpen: () => undefined,
  accountOpen: false,
  setAccountOpen: () => undefined,
});

export const useUiContext = (): UiContext => useContext(MyUiContext);
