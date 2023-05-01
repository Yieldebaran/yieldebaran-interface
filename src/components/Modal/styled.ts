import styled from 'styled-components';

export const ModalInner = styled.div`
  display: inline-block;
  width: auto;
  vertical-align: middle;
  position: relative;
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

export const ModalContent = styled.div`
  position: relative;
  padding: 2rem 4rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  text-align: initial;
  font-size: 1rem;
  @media screen and (max-width: 500px) {
    padding: 1rem 1rem;
  }
`;

export const ModalTitle = styled.h1`
  font-size: 2rem;
  font-style: normal;
  color: inherit;
  text-align: center;
  margin: 0 6rem 0 0;
  @media screen and (max-width: 500px) {
    font-size: 1.8rem;
  }
`;

export const StyledModal = styled.div`
  text-align: center;
  height: 100%;
  overflow: auto;
  padding: 3rem 0 3rem;
  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    margin-right: 0;
  }
`;

export const ModalControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 2rem;
`;

export const ModalOuter = styled.div`
  position: fixed;
  background: rgba(37, 37, 37, 0.3);
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  vertical-align: middle;
  z-index: 1000;
`;

export const ModalClose = styled.div`
  margin-left: auto;
  text-align: right;
  cursor: pointer;
`;
