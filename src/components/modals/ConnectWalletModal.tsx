import { useWeb3React } from '@web3-react/core';
import React from 'react';
import cbw from 'src/assets/icons/cbw.png';
import mm from 'src/assets/icons/mm.png';
import wc from 'src/assets/icons/wc.png';
import xdefi from 'src/assets/icons/XDEFIWallet.jpeg';
import Modal from 'src/components/Modal/modal';

import 'src/components/modals/ConnectWalletModal.css';
import { connectrorsEnum, GetConnector } from 'src/connectors/connectors';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

export const ConnectWalletModal: React.FC = () => {
  const { chainConfig } = useChain();
  const setModal = useSetModal();
  const { activate } = useWeb3React();

  const handleConnect = async (c: any) => {
    const con = GetConnector(c, setModal, chainConfig ? chainConfig.chainId : undefined);

    setModal(null);

    try {
      await activate(con);
      window.localStorage.setItem('yieldebaran-provider', c);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={true} onClose={() => setModal(null)} title="Connect Wallet">
      <div className="wallets">
        <div className="wallet-item" onClick={() => handleConnect(connectrorsEnum.Metamask)}>
          <div className="wallet-item-icon">
            <img src={mm} alt="" />
          </div>
          <div className="wallet-item-name">Metamask</div>
        </div>
        <div className="wallet-item" onClick={() => handleConnect(connectrorsEnum.WalletConnect)}>
          <div className="wallet-item-icon">
            <img src={wc} alt="" />
          </div>
          <div className="wallet-item-name">Wallet Connect</div>
        </div>
        <div className="wallet-item" onClick={() => handleConnect(connectrorsEnum.Coinbase)}>
          <div className="wallet-item-icon">
            <img src={cbw} alt="" />
          </div>
          <div className="wallet-item-name">Coinbase Wallet</div>
        </div>
        <div className="wallet-item" onClick={() => handleConnect(connectrorsEnum.xDefi)}>
          <div className="wallet-item-icon">
            <img src={xdefi} alt="" />
          </div>
          <div className="wallet-item-name">xDefi Wallet</div>
        </div>
      </div>
    </Modal>
  );
};
