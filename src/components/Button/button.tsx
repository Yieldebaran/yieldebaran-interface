import React, { HTMLAttributes, ReactNode } from 'react';
import { Spinner } from 'src/assets/huIcons/huIcons';
import { FCC } from 'src/types/FCC';
import styled from 'styled-components';
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
  invertColors?: boolean;
}

export const StyledButton = styled.div<{ invertColors: Props['invertColors'] }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid ${(p) => (p.invertColors ? '#000' : '#fff')};
  padding: 0.5rem 1.2rem 0.3rem;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  &:hover {
    background: ${(p) => (p.invertColors ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)')};
  }
`;

const Arrow = styled.span`
  margin-left: 0.6rem;
`;

export const Button: FCC<Props & HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  arrow,
  loading,
  image,
  disabled,
  children,
  invertColors,
  ...others
}) => {
  return (
    <StyledButton
      {...others}
      onClick={loading || disabled ? () => null : onClick}
      invertColors={invertColors}
    >
      {image && <div className="button-image">{image}</div>}
      {loading ? (
        <span>
          <Spinner size={'30px'} />
        </span>
      ) : (
        <span style={{ flexGrow: 1 }}>{children}</span>
      )}
      {arrow && <Arrow>&#9660;</Arrow>}
    </StyledButton>
  );
};
