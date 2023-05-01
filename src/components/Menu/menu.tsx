import React from 'react';

import AddressButton from 'src/components/Menu/AddressButton/addressButton';
import { NetworkSelector } from 'src/components/Menu/NetworkButton/networkSelector';
import Navbar from 'src/components/Navbar/navbar';
import NavBarRight from 'src/components/Navbar/navBarRight';
import ThemeSwitch from 'src/components/Navbar/themeSwitch';
import { useAppearance } from 'src/providers/AppearanceProvider';

const Menu: React.FC = () => {
  const { isTablet, isMobile, show } = useAppearance();
  const showNavbar = !isTablet && !isMobile && show;

  if (!showNavbar) return null;

  return (
    <Navbar isMobile={isMobile} isTablet={isTablet}>
      <NavBarRight>
        <NetworkSelector />
        <AddressButton />
        <ThemeSwitch />
      </NavBarRight>
    </Navbar>
  );
};

export default Menu;
