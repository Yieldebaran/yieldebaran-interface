import React, { useState } from 'react';
import Markets from 'src/Components/Markets/markets';
import PoolDialog from 'src/Components/Markets/MarketsDialogs/PoolDialog/PoolDialog';
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
      <Markets supplyMarketDialog={supplyMarketDialog} />
      {openSupplyMarketDialog ? (
        <PoolDialog closeSupplyMarketDialog={closeSupplyMarketDialog} />
      ) : null}
    </>
  );
};

export default Home;
