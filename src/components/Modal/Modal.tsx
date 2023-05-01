import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import CSSTransition from 'react-transition-group/CSSTransition';
import { FCC } from 'src/types/FCC';

import {
  ModalClose,
  ModalContent,
  ModalControlsContainer,
  ModalHeader,
  ModalInner,
  ModalOuter,
  ModalTitle,
  StyledModal,
} from './styled';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  ModalControls?: React.FC;
}

const Modal: FCC<Props> = ({ open, onClose, title, children, ModalControls }) => {
  const modalContainer = document.getElementById('modal') as Element;
  const [show, setShow] = useState(false);
  const innerRef = useRef(null);

  useEffect(() => {
    setShow(true);
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    window.onscroll = () => {
      window.scroll(scrollLeft, scrollTop);
    };
    return () => {
      window.onscroll = () => null;
    };
  }, []);

  function handleClose() {
    setShow(false);
    setTimeout(() => onClose(), 200);
  }

  const modal = (
    <ModalOuter onClick={handleClose}>
      <StyledModal>
        <CSSTransition
          in={show}
          timeout={200}
          classNames={'scale'}
          unmountOnExit
          nodeRef={innerRef}
        >
          <ModalInner ref={innerRef}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader onClick={onClose}>
                {title && <ModalTitle>{title}</ModalTitle>}
                <ModalClose>Close [x]</ModalClose>
              </ModalHeader>
              {children}
              {ModalControls && (
                <ModalControlsContainer>
                  <ModalControls />
                </ModalControlsContainer>
              )}
            </ModalContent>
          </ModalInner>
        </CSSTransition>
      </StyledModal>
    </ModalOuter>
  );

  return open ? ReactDOM.createPortal(modal, modalContainer) : null;
};

export default Modal;
