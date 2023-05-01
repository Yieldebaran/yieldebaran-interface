import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import { Button } from 'src/components/Button/button';
import Modal from 'src/components/Modal/Modal';

import 'src/components/modals/AccountModal.css';
import { getShortenAddress } from 'src/helpers';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

export const AccountModal: React.FC = () => {
  const { chainConfig } = useChain();
  const { connector, deactivate, account } = useWeb3React<ethers.providers.Web3Provider>();
  const setModal = useSetModal();

  function handleModalClose() {
    setModal(null);
  }

  const handleDisconnect = () => {
    try {
      (connector as any).close();
    } catch {}

    window.localStorage.removeItem('yieldebaran-provider');
    deactivate();
    handleModalClose();
  };

  return (
    <Modal open={true} onClose={handleModalClose} title="Address">
      <div className="account-settings">
        <div className="account-settings-address">
          <div className="network-logo">
            <img src={chainConfig?.logo} alt="chain-logo" />
          </div>
          <span>{getShortenAddress(account, 4)}</span>
        </div>
        <Button onClick={() => handleDisconnect()} invertColors>
          <span>Disconnect</span>
        </Button>
      </div>
    </Modal>
  );
};
