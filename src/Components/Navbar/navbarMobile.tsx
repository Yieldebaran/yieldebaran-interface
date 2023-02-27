import React, { ReactNode } from 'react';
import { useAppearance } from 'src/providers/AppearanceProvider';
import './navbar.css';

interface Props {
  children?: ReactNode;
}

const NavbarMobile: React.FC<Props> = ({ children }: Props) => {
  const { mobileMenuOpen } = useAppearance();
  return (
    <div className={`navbar-mobile-content ${mobileMenuOpen ? 'navbar-mobile-content-open' : ''}`}>
      {children}
    </div>
  );
};

export default NavbarMobile;
