import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import { MainBlock } from 'src/Components/MainBlock/MainBlock';
import DepositTab from 'src/Components/Markets/MarketsDialogs/PoolDialog/DepositTab';
import InstantWithdrawTab from 'src/Components/Markets/MarketsDialogs/PoolDialog/InstantWithdrawTab';
import poolDialog from 'src/Components/Markets/MarketsDialogs/PoolDialog/PoolDialog';
import WithdrawTab from 'src/Components/Markets/MarketsDialogs/PoolDialog/WithdrawTab';
import {
  Tab,
  TabContent,
  TabContentItem,
  TabHeader,
  TabHeaderItem,
} from 'src/Components/TabControl/tabControl';
import Wrapper from 'src/Components/Wrapper/wrapper';
import { useYieldebaranDataContext } from 'src/Types/appDataContext';

export const PoolAddress = () => {
  const { selectedPool, setSelectedPool, eapStates } = useYieldebaranDataContext();
  const [tabChange, setTabChange] = useState<number>(1);
  const [tabHeaders, setTabHeaders] = useState<any[]>([]);
  const [tabContents, setTabContents] = useState<any>([]);

  const params = useParams();

  const mountedSupply = useRef<boolean>(false);

  const eap: any = selectedPool ? eapStates[selectedPool] : { underlyingSymbol: '' };

  useEffect(() => {
    console.log('dfkjjfks', selectedPool)
  }, [selectedPool])

  useEffect(() => {
    console.log('skfjdsf', 'hello')
    if (!params.poolAddress) return;
    console.log('skfjdsf', params)
    setSelectedPool(params.poolAddress);
  }, [params.poolAddress]);

  useEffect(() => {
    mountedSupply.current = true;
    setTabChange(1);
  }, []);

  useEffect(() => {
    if (selectedPool && mountedSupply.current) {
      const headers = [];
      const contents = [];
      headers.push({ title: 'Deposit' });
      contents.push(<DepositTab selectedPool={selectedPool} />);
      // headers.push({title: "Stake"})
      // contents.push(<DirectStakeMarketTab selectedPool={selectedPool}/>)

      headers.push({ title: 'Withdraw' });
      contents.push(<WithdrawTab selectedPool={selectedPool} />);
      // contents.push(<InstantWithdrawalTab selectedPool={selectedPool}/>)

      headers.push({ title: 'Fast withdraw' });
      contents.push(<InstantWithdrawTab selectedPool={selectedPool} />);
      // contents.push(<WithdrawItem selectedPool={selectedPool}/>)

      setTabHeaders(headers);
      setTabContents(contents);
    }
  }, [selectedPool]);

  console.log('sdkafjkdsf', mountedSupply.current)
  console.log('sdkafjkdsf selectedPool', selectedPool)
  console.log('sdkafjkdsf', tabHeaders)
  console.log('sdkafjkdsf', params)

  if (mountedSupply.current && selectedPool && tabHeaders.length > 0) {
    return (
      <Wrapper>
        <MainBlock>
          <p>{params.poolAddress}</p>
          <ReactToolTip id="borrow-dialog-tooltip" effect="solid" />
          <div className="supply-box">
            <div className="dialog-title">
              {selectedPool && (
                <div className="logo-container">
                  <img
                    className="rounded-circle"
                    style={{ width: '30px', height: '30px' }}
                    src={eap?.underlyingLogo}
                    alt=""
                  />
                </div>
              )}
              {eap?.underlyingSymbol}
            </div>
            <div className="seperator" />
            <Tab>
              <TabHeader tabIndex={tabChange}>
                {tabHeaders.map((h, index) => {
                  return (
                    <TabHeaderItem
                      key={index}
                      tabId={index + 1}
                      title={h.title}
                      tabChange={tabChange}
                      setTabChange={setTabChange}
                    />
                  );
                })}
              </TabHeader>
              <TabContent>
                {(tabContents as any[]).map((c, index) => {
                  return (
                    <TabContentItem key={index} tabId={index + 1} tabChange={tabChange} open={true}>
                      {c}
                    </TabContentItem>
                  );
                })}
              </TabContent>
            </Tab>
          </div>
        </MainBlock>
      </Wrapper>
    );
  }

  return null;
};
