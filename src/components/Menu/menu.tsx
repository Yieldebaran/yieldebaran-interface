import React from 'react';

import AddressButton from 'src/components/Menu/AddressButton/addressButton';
import NetworkButton from 'src/components/Menu/NetworkButton/networkButton';
import Navbar from 'src/components/Navbar/navbar';
import NavbarLeft from 'src/components/Navbar/navBarLeft';
import NavbarLink from 'src/components/Navbar/navBarLink';
import NavBarLinks from 'src/components/Navbar/navBarLinks';
import NavbarLogo from 'src/components/Navbar/navbarLogo';
import NavBarRight from 'src/components/Navbar/navBarRight';
import ThemeSwitch from 'src/components/Navbar/themeSwitch';
import { useAppearance } from 'src/providers/AppearanceProvider';

const Menu: React.FC = () => {
  const { isTablet, isMobile, show } = useAppearance();
  const showNavbar = !isTablet && !isMobile && show;

  if (!showNavbar) return null;

  return (
    <Navbar isMobile={isMobile} isTablet={isTablet}>
      <NavbarLeft>
        <NavbarLogo />
        <NavBarLinks>
          <NavbarLink link="https://github.com/yieldebaran/yieldebaran-interface" target="_blank">
            Interface repo
          </NavbarLink>
          <NavbarLink link="https://github.com/yieldebaran/yieldebaran-contracts" target="_blank">
            Contracts repo
          </NavbarLink>
        </NavBarLinks>
      </NavbarLeft>
      <NavBarRight>
        <NetworkButton />
        <AddressButton />
        <ThemeSwitch />
      </NavBarRight>
    </Navbar>
  );
};

export default Menu;
