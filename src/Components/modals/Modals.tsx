import { AccountModal } from 'src/Components/modals/AccountModal';
import { ConnectWalletModal } from 'src/Components/modals/ConnectWalletModal';
import { SelectChainModal } from 'src/Components/modals/SelectChainModal';
import { ModalSettings } from 'src/providers/store/modal';
import { useModal } from 'src/providers/StoreProvider';

const renderModal = (modal: ModalSettings) => {
  switch (modal.key) {
    case 'selectChain':
      return <SelectChainModal />;
    case 'connectWallet':
      return <ConnectWalletModal />;
    case 'account':
      return <AccountModal />;
    default:
      return null;
  }
};

export const Modals = () => {
  const modal = useModal();
  return modal ? renderModal(modal) : null;
};
