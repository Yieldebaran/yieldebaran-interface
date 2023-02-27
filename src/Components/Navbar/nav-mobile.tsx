import React from 'react';

import ReactDOM from 'react-dom';
import { useAppearance } from 'src/providers/AppearanceProvider';

import AddressButton from '../Menu/AddressButton/addressButton';
import NetworkButton from '../Menu/NetworkButton/networkButton';
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
        <NetworkButton />
        <NavbarLink link="https://dashboard.hundred.finance" target="_blank">
          Dashboard
        </NavbarLink>
        <NavbarLink link="https://app.multichain.org/#/router" target="_blank">
          Bridge
        </NavbarLink>
        <NavbarLink link="https://docs.hundred.finance" target="_blank">
          Docs
        </NavbarLink>
        <NavbarLink link="https://vote.hundred.finance" target="_blank">
          Vote
        </NavbarLink>
        <NavbarLink link="https://lendly.hundred.finance" target="_blank">
          Lendly
        </NavbarLink>
      </div>
    </div>
  );

  return mobileMenuOpen ? ReactDOM.createPortal(navMobile, navMobileContainer) : null;
};

export default NavMobile;
