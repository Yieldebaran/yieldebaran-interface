import React from 'react';
import { Logo } from 'src/components/Logo';
import AddressButton from 'src/components/Menu/AddressButton/addressButton';
import { NetworkSelector } from 'src/components/Menu/NetworkButton/networkSelector';
import { HeaderLinks } from 'src/components/Navbar/navBarLinks';
import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem;
  @media screen and (max-width: 500px) {
    flex-wrap: wrap;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 500px) {
    margin-left: auto;
  }
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Logo />
      <HeaderLinks />
      <HeaderControls>
        <NetworkSelector />
        <AddressButton />
      </HeaderControls>
    </StyledHeader>
  );
};
