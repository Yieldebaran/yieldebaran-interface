import React, { useState } from 'react';
import { PoolModal } from 'src/components/modals/PoolModal/PoolModal';
import { PoolsList } from 'src/components/PoolsList/PoolsList';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { useContractsData } from 'src/providers/ContractsDataProvider';

const Home: React.FC = () => {
  const { spinnerVisible } = useAppearance();
  const { setSelectedPool } = useContractsData();

  const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false);

  const supplyMarketDialog = (pool: string) => {
    setSelectedPool(pool);
    setOpenSupplyDialog(true);
  };

  const closeSupplyMarketDialog = () => {
    if (!spinnerVisible) {
      setOpenSupplyDialog(false);
    }
  };

  // render main logic frame
  return (
    <>
      <PoolsList supplyMarketDialog={supplyMarketDialog} />
      {openSupplyMarketDialog ? (
        <PoolModal closeSupplyMarketDialog={closeSupplyMarketDialog} />
      ) : null}
    </>
  );
};

export default Home;
