import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import Button from 'src/Components/Button/button';
import Modal from 'src/Components/Modal/modal';
import { getShortenAddress } from 'src/helpers';
import { useSetModal } from 'src/providers/StoreProvider';
import { useGlobalContext } from 'src/Types/globalContext';

import './account.css';

export const AccountModal: React.FC = () => {
  const { address, setAddress, network } = useGlobalContext();
  const { connector, deactivate } = useWeb3React<ethers.providers.Web3Provider>();
  const setModal = useSetModal();

  function handleModalClose() {
    setModal(null);
  }

  const handleDisconnect = () => {
    try {
      (connector as any).close();
    } catch {}

    window.localStorage.removeItem('provider');
    deactivate();
    handleModalClose();
    setAddress('');
  };

  return (
    <Modal open={true} close={handleModalClose} title="Address" maxheight="220px">
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
