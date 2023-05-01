import React from 'react';

import { NetworkSelector } from 'src/components/Menu/NetworkButton/networkSelector';
import { useAppearance } from 'src/providers/AppearanceProvider';

import Navbar from '../Navbar/navbar';
import NavBarButton from '../Navbar/navBarButton';
import NavbarLogo from '../Navbar/navbarLogo';
import NavbarMobile from '../Navbar/navbarMobile';
import NavBarRight from '../Navbar/navBarRight';
import ThemeSwitch from '../Navbar/themeSwitch';

import AddressButton from './AddressButton/addressButton';

const TabletMenu: React.FC = () => {
  const { isTablet, isMobile, show } = useAppearance();

  return (isTablet || isMobile) && show ? (
    <>
      <Navbar isMobile={isMobile} isTablet={isTablet}>
        <NavbarLogo />
        <NavBarRight>
          {isTablet && !isMobile ? (
            <>
              <NetworkSelector />
              <AddressButton />
            </>
          ) : null}
          <ThemeSwitch />
          <NavBarButton />
        </NavBarRight>
      </Navbar>
      <NavbarMobile>
        {isMobile ? (
          <NavBarRight className="navbar-right-content">
            <NetworkSelector />
            <AddressButton />
          </NavBarRight>
        ) : null}
      </NavbarMobile>
    </>
  ) : null;
};

export default TabletMenu;
