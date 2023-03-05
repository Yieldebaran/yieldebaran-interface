import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from 'src/components/Button/button';

import { getShortenAddress } from 'src/helpers';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { useSetModal } from 'src/providers/StoreProvider';

const AddressButton: React.FC = () => {
  const { setMobileMenuOpen } = useAppearance();
  const { account } = useWeb3React<providers.Web3Provider>();
  const setModal = useSetModal();

  const openAccount = () => {
    setMobileMenuOpen(false);
    setModal({ key: 'account' });
  };

  const openWallets = () => {
    setMobileMenuOpen(false);
    setModal({ key: 'connectWallet' });
  };

  return account ? (
    <Button
      onClick={() => openAccount()}
      arrow={true}
      image={<Jazzicon diameter={30} seed={jsNumberForAddress(account)} />}
    >
      {getShortenAddress(account)}
    </Button>
  ) : (
    <Button onClick={() => openWallets()}>
      <span>Connect</span>
    </Button>
  );
};

export default AddressButton;
