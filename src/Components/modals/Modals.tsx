import { SelectChainModal } from 'src/Components/modals/SelectChainModal';
import { ModalSettings } from 'src/providers/store/modal';
import { useModal } from 'src/providers/StoreProvider';

const renderModal = (modal: ModalSettings) => {
  switch (modal.key) {
    case 'selectChain':
      return <SelectChainModal />;
    default:
      return null;
  }
};

export const Modals = () => {
  const modal = useModal();
  console.log('dksfjd', modal);
  return modal ? renderModal(modal) : null;
};
