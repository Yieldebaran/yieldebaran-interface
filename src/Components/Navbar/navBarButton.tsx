import React from 'react';
import { useAppearance } from 'src/providers/AppearanceProvider';
import './navbarButton.css';

const NavBarButton: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useAppearance();

  const handleClick = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      className={`navbar-button ${mobileMenuOpen ? 'navbar-button-clicked' : ''}`}
      onClick={() => handleClick()}
    >
      <span className="bar bar1"></span>
      <span className="bar bar2"></span>
      <span className="bar bar3"></span>
    </div>
  );
};

export default NavBarButton;
