import React from 'react';

import { useUiContext } from '../../Types/uiContext';

import Navbar from '../Navbar/navbar';
import NavbarLeft from '../Navbar/navBarLeft';
import NavbarLink from '../Navbar/navBarLink';
import NavBarLinks from '../Navbar/navBarLinks';
import NavbarLogo from '../Navbar/navbarLogo';
import NavBarRight from '../Navbar/navBarRight';
import ThemeSwitch from '../Navbar/themeSwitch';

import AddressButton from './AddressButton/addressButton';

import NetworkButton from './NetworkButton/networkButton';

const Menu: React.FC = () => {
  const { isTablet, isMobile, show } = useUiContext();
  return !isTablet && !isMobile && show ? (
    <Navbar isMobile={isMobile} isTablet={isTablet}>
      <NavbarLeft>
        <NavbarLogo />
        <NavBarLinks>
          <NavbarLink link="https://docs.hundred.finance" target="_blank">
            Docs
          </NavbarLink>
        </NavBarLinks>
      </NavbarLeft>
      <NavBarRight>
        <NetworkButton />
        <AddressButton />
        <ThemeSwitch />
        {/* <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/> */}
      </NavBarRight>
    </Navbar>
  ) : null;
};

export default Menu;
