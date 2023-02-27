import React from 'react';

import AddressButton from 'src/Components/Menu/AddressButton/addressButton';
import NetworkButton from 'src/Components/Menu/NetworkButton/networkButton';
import Navbar from 'src/Components/Navbar/navbar';
import NavbarLeft from 'src/Components/Navbar/navBarLeft';
import NavbarLink from 'src/Components/Navbar/navBarLink';
import NavBarLinks from 'src/Components/Navbar/navBarLinks';
import NavbarLogo from 'src/Components/Navbar/navbarLogo';
import NavBarRight from 'src/Components/Navbar/navBarRight';
import ThemeSwitch from 'src/Components/Navbar/themeSwitch';
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
