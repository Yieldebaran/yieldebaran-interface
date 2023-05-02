import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AllocationInfoTab } from 'src/components/modals/PoolModal/Tabs/AllocationInfoTab';
import DepositTab from 'src/components/modals/PoolModal/Tabs/DepositTab';
import InstantWithdrawTab from 'src/components/modals/PoolModal/Tabs/InstantWithdrawTab';
import WithdrawTab from 'src/components/modals/PoolModal/Tabs/WithdrawTab';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import { MainBlock } from 'src/uiKit/MainBlock';
import { UiTab, UiTabs } from 'src/uiKit/UiTabs';
import styled from 'styled-components';

import { useChain } from '../../providers/ChainProvider';

const TABS = Object.freeze([
  { id: 'deposit', title: 'Deposit', component: <DepositTab /> },
  { id: 'withdraw', title: 'Withdrawal', component: <WithdrawTab /> },
  { id: 'quickWithdraw', title: 'Quick withdrawal', component: <InstantWithdrawTab /> },
  { id: 'info', title: 'Info', component: <AllocationInfoTab /> },
]);

const PoolContainer = styled(MainBlock)`
  max-width: 700px;
  margin: 0 auto;
`;

const PoolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;

  @media screen and (max-width: 500px) {
    flex-direction: column;
    margin-bottom: 3rem;
    h1 {
      margin-bottom: 1rem;
    }
  }
`;

export const PoolAddress = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedPool, eap } = useContractsData();
  const [currentTab, setCurrentTab] = useState<typeof TABS[number]['id']>(TABS[0].id);

  const { poolAddress } = useParams();
  const { chainConfig } = useChain();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab) {
      setCurrentTab(TABS[0].id);
      return;
    }
    setCurrentTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!poolAddress) return;
    setSelectedPool(poolAddress);
  }, [poolAddress]);

  if (!eap) return null;

  return (
    <PoolContainer>
      <PoolHeader>
        <h1>{eap.underlyingSymbol} pool</h1>
        <span><a target={'_blank'} rel={'noreferrer'} href={`${chainConfig!.explorerUrl}/address/${poolAddress}`}>{poolAddress}</a></span>
      </PoolHeader>
      <UiTabs>
        {TABS.map((tab) => (
          <UiTab
            className={currentTab === tab.id ? 'active' : ''}
            key={tab.id}
            onClick={() => {
              setCurrentTab(tab.id);
              searchParams.set('tab', tab.id);
              setSearchParams(searchParams);
            }}
          >
            {tab.title}
          </UiTab>
        ))}
      </UiTabs>
      {TABS.find((tab) => tab.id === currentTab)?.component}
    </PoolContainer>
  );
};
