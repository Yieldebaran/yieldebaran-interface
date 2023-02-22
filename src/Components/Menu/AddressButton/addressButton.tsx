import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from 'src/Components/Button/button';

import { getShortenAddress } from 'src/helpers';
import { useUiContext } from 'src/Types/uiContext';

const AddressButton: React.FC = () => {
  const { setShowWallets, setMobileMenuOpen, setAccountOpen } = useUiContext();
  const { account } = useWeb3React<providers.Web3Provider>();

  const openAccount = () => {
    setMobileMenuOpen(false);
    setAccountOpen(true);
  };

  const openWallets = () => {
    setMobileMenuOpen(false);
    setShowWallets(true);
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
