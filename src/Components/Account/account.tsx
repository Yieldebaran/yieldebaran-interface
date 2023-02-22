import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';

import { getShortenAddress } from 'src/helpers';
import { useGlobalContext } from 'src/Types/globalContext';
import { useUiContext } from 'src/Types/uiContext';

import Button from '../Button/button';
import Modal from '../Modal/modal';
import './account.css';

const Account: React.FC = () => {
  const { accountOpen, setAccountOpen } = useUiContext();
  const { address, setAddress, network } = useGlobalContext();
  const { connector, deactivate } = useWeb3React<ethers.providers.Web3Provider>();

  const handleDisconnect = () => {
    try {
      (connector as any).close();
    } catch {}

    window.localStorage.removeItem('provider');
    deactivate();

    setAccountOpen(false);
    setAddress('');
  };

  return (
    <Modal open={accountOpen} close={() => setAccountOpen(false)} title="Address" maxheight="220px">
      <div className="account-settings">
        <div className="account-settings-address">
          <div className="network-logo">
            <img src={network?.logo} alt="" />
          </div>
          <span>{getShortenAddress(address, 4)}</span>
        </div>
        <Button onClick={() => handleDisconnect()}>
          <span>Disconnect</span>
        </Button>
      </div>
    </Modal>
  );
};

export default Account;
