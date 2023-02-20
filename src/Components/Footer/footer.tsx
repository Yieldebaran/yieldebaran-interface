import React from 'react';

import { Discord, Medium, Telegram, Twitter, YieldebaranLogo } from '../../assets/assets';

import './footer.css';

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
          <a href="https://blog.hundred.finance" target={'_blank'} rel={'noreferrer'}>
            <div className="footer_logo">
              <Medium />
            </div>
            <p>Medium</p>
          </a>
          <a href="https://discord.com/invite/phK668J6dQ" target={'_blank'} rel={'noreferrer'}>
            <div className="footer_logo">
              <Discord />
            </div>
            <p>Discord</p>
          </a>
          <a href="https://twitter.com/Yieldebaran" target={'_blank'} rel={'noreferrer'}>
            <div className="footer_logo">
              <Twitter />
            </div>
            <p>Twitter</p>
          </a>
          <a href="https://t.me/joinchat/z0gRXOqZAEQ1ZDRk" target={'_blank'} rel={'noreferrer'}>
            <div className="footer_logo">
              <Telegram />
            </div>
            <p>Telegram</p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
