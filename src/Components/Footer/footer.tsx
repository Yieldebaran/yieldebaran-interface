import React from 'react';

import './footer.css';
import { YieldebaranLogo, Discord, Medium, Twitter, Telegram } from '../../assets/assets';

const Footer: React.FC = () => {
  return (
    <footer className="footer_wrapper">
      <div className="footer_content">
        <div className="content_logo">
          <YieldebaranLogo width="150" height="27" />
        </div>
        <div className="content">
          <h4>Documents</h4>
          <a href="https://docs.hundred.finance/support/faq" target={'_blank'} rel={'noreferrer'}>
            <p>FAQ</p>
          </a>
          <a href="https://github.com/yieldebaran" target={'_blank'} rel={'noreferrer'}>
            <p>Github</p>
          </a>
        </div>
        <div className="content">
          <h4>Community</h4>
          <a href="https://linktr.ee/yieldebaran" target={'_blank'} rel={'noreferrer'}>
            <div className="footer_logo">
              <Medium />
            </div>
            <div className="footer_logo">
              <Discord />
            </div>
            <div className="footer_logo">
              <Twitter />
            </div>
            <div className="footer_logo">
              <Telegram />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
