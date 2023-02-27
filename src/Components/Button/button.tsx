import React, { ReactNode } from 'react';
import { Spinner } from 'src/assets/huIcons/huIcons';
import { useAppearance } from 'src/providers/AppearanceProvider';
import './button.css';

interface Props {
  onClick?: () => void;
  arrow?: boolean;
  small?: boolean;
  large?: boolean;
  loading?: boolean;
  active?: boolean;
  image?: any;
  disabled?: boolean;
  rectangle?: boolean;
  searchText?: boolean;
  children?: ReactNode;
}

const Button: React.FC<Props> = ({
  onClick,
  arrow,
  small,
  large,
  loading,
  active,
  image,
  disabled,
  rectangle,
  searchText,
  children,
}: Props) => {
  const { isMobile, isTablet } = useAppearance();

  let className = '';
  if (disabled || loading) className += 'button-disabled ';
  if (small) className += 'button-small ';
  if (!isMobile || !isTablet) className += 'button-xsmall ';
  if (rectangle) className += 'button-rectangle ';
  if (large) className += 'button-rectangle-large ';
  if (active) className += 'button-active ';
  if (searchText) className += 'search-text-button ';

  return (
    <div className={`button ${className}`} onClick={loading || disabled ? () => null : onClick}>
      {image && <div className="button-image">{image}</div>}
      {loading ? (
        <span>
          <Spinner size={'30px'} />
        </span>
      ) : (
        <span>{children}</span>
      )}
      {arrow && <div className="arrow">&#9660;</div>}
    </div>
  );
};

export default Button;
