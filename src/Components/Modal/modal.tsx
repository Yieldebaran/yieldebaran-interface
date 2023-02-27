import React from 'react';
import ReactDOM from 'react-dom';

import closeIcon from 'src/assets/icons/closeIcon.png';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { FCC } from 'src/types/FCC';

import './modal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  titleImg?: string;
  maxheight?: string;
  error?: boolean;
}

const Modal: FCC<Props> = ({ open, onClose, title, titleImg, maxheight, error, children }) => {
  const { darkMode } = useAppearance();
  const modalContainer = document.getElementById('modal') as Element;

  const modal = (
    <div className={`modal ${darkMode ? 'dark' : 'light'}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-wrapper" style={{ maxHeight: maxheight ? maxheight : '82%' }}>
        <div className="modal-title">
          {titleImg ? <img src={titleImg} alt="" className="title-img" /> : null}
          {error ? (
            <span className="error">
              <span>!</span>
              {title}
            </span>
          ) : (
            <span>{title}</span>
          )}
          <img src={closeIcon} alt="" onClick={onClose} className="modal-close" />
        </div>
        <div className="seperator" />
        {children}
      </div>
    </div>
  );

  return open ? ReactDOM.createPortal(modal, modalContainer) : null;
};

export default Modal;
