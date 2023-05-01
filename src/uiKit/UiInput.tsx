import React, { useRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div<{ error?: string }>`
  position: relative;
  box-shadow: inset 0.5px 0.5px 0 0.5px ${(p) => (p.error ? '#C73E1D' : '#fff')};
  border: 1px solid ${(p) => (p.error ? '#C73E1D' : '#fff')};
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  color: #000;
  padding: 0.8rem 1rem 0.5rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  bottom: calc(100% + 0.2rem);
  color: #c73e1d;
`;

const StyledInput = styled.input<{ withLeftAdornment?: boolean; withRightAdornment?: boolean }>`
  border: none;
  box-shadow: none;
  flex-grow: 1;
  border-radius: 0;
  background: transparent;
  ${(p) => (p.withLeftAdornment ? 'padding-left: .6rem;' : '')}
  ${(p) => (p.withRightAdornment ? 'padding-right: .6rem;' : '')}
  &:focus,
  &:active {
    border: none;
    box-shadow: none;
    outline: none;
  }
`;

interface Props {
  style?: React.CSSProperties;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  LeftAdornment?: React.ReactNode;
  RightAdornment?: React.ReactNode;
}

export const UiInput: React.FC<Props> = ({
  style,
  error,
  value,
  onChange,
  LeftAdornment = null,
  RightAdornment = null,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function containerClickHandler() {
    if (!inputRef || !inputRef.current) return;

    inputRef.current.focus();
  }

  return (
    <InputContainer style={style} onClick={containerClickHandler} error={error}>
      <ErrorMessage>{error}</ErrorMessage>
      {LeftAdornment}
      <StyledInput
        onChange={onChange}
        ref={inputRef}
        value={value}
        withLeftAdornment={!!LeftAdornment}
        withRightAdornment={!!RightAdornment}
      />
      {RightAdornment}
    </InputContainer>
  );
};
