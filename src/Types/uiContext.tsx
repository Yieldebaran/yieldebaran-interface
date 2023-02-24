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
  toastSuccessMessage: (m: string, autoClose?: boolean, closeDelay?: number) => void;
  toastErrorMessage: (message: string, autoClose?: boolean, closeDelay?: number) => void;
  scale: boolean;
  setScale: (h: boolean) => void;
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
  toastSuccessMessage: () => undefined,
  toastErrorMessage: () => undefined,
  scale: false,
  setScale: () => undefined,
  mobileMenuOpen: false,
  setMobileMenuOpen: () => undefined,
  accountOpen: false,
  setAccountOpen: () => undefined,
});

export const useUiContext = (): UiContext => useContext(MyUiContext);
