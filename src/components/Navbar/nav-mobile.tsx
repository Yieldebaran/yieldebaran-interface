import React from 'react';

import ReactDOM from 'react-dom';
import { NetworkSelector } from 'src/components/Menu/NetworkButton/networkSelector';
import { useAppearance } from 'src/providers/AppearanceProvider';

import AddressButton from '../Menu/AddressButton/addressButton';
import './nav-mobile.css';

import NavbarLink from './navBarLink';

const NavMobile: React.FC = () => {
  const { darkMode, setMobileMenuOpen, mobileMenuOpen } = useAppearance();
  const navMobileContainer = document.getElementById('modal') as Element;

  const navMobile = (
    <div className={`nav-mobile ${darkMode ? 'dark' : 'light'}`}>
      <div className="nav-mobile-background" onClick={() => setMobileMenuOpen(false)}></div>
      <div className="nav-mobile-body">
        <AddressButton />
        <NetworkSelector />
        <NavbarLink link="https://github.com/yieldebaran/yieldebaran-interface" target="_blank">
          Interface repo
        </NavbarLink>
        <NavbarLink link="https://github.com/yieldebaran/yieldebaran-contracts" target="_blank">
          Contracts repo
        </NavbarLink>
      </div>
    </div>
  );

  return mobileMenuOpen ? ReactDOM.createPortal(navMobile, navMobileContainer) : null;
};

export default NavMobile;
