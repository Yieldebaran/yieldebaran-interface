import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import ReactToolTip from 'react-tooltip';

import closeIcon from '../../../../assets/icons/closeIcon.png';

import { useYieldebaranDataContext } from '../../../../Types/appDataContext';
import { useUiContext } from '../../../../Types/uiContext';
import {
  Tab,
  TabContent,
  TabContentItem,
  TabHeader,
  TabHeaderItem,
} from '../../../TabControl/tabControl';

import '../marketDialog.css';
import DepositTab from './DepositTab';
import InstantWithdrawTab from './InstantWithdrawTab';
import WithdrawTab from './WithdrawTab';
import AllocationInfoTab from './AllocationInfoTab';

interface Props {
  closeSupplyMarketDialog: () => void;
}

const PoolDialog: React.FC<Props> = (props: Props) => {
  const { selectedPool, setSelectedPool, eapStates } = useYieldebaranDataContext();
  const { spinnerVisible, darkMode } = useUiContext();
  const [tabChange, setTabChange] = useState<number>(1);
  const [tabHeaders, setTabHeaders] = useState<any[]>([]);
  const [tabContents, setTabContents] = useState<any>([]);

  const mountedSupply = useRef<boolean>(false);

  const eap: any = selectedPool ? eapStates[selectedPool] : { underlyingSymbol: '' };

  const dialogContainer = document.getElementById('modal') as Element;

  const CloseDialog = () => {
    if (spinnerVisible) return;
    props.closeSupplyMarketDialog();
  };

  useEffect(() => {
    mountedSupply.current = true;
    setTabChange(1);
    return () => {
      setSelectedPool(undefined);
      mountedSupply.current = false;
    };
  }, []);

  useEffect(() => {
    if (selectedPool && mountedSupply.current) {
      const headers = [];
      const contents = [];
      headers.push({ title: 'Deposit' });
      contents.push(<DepositTab selectedPool={selectedPool} />);

      headers.push({ title: 'Withdrawal' });
      contents.push(<WithdrawTab selectedPool={selectedPool} />);

      headers.push({ title: 'Quick withdrawal' });
      contents.push(<InstantWithdrawTab selectedPool={selectedPool} />);

      headers.push({ title: 'Info' });
      contents.push(<AllocationInfoTab selectedPool={selectedPool} />);

      setTabHeaders(headers);
      setTabContents(contents);
    }
  }, [selectedPool, eap]);

  const dialog =
    mountedSupply.current && selectedPool && tabHeaders.length > 0 ? (
      <div className={`dialog open-dialog ${darkMode ? 'dark' : 'light'}`}>
        <ReactToolTip id="borrow-dialog-tooltip" effect="solid" />
        <div className="dialog-background" onClick={() => CloseDialog()}></div>
        <div className="supply-box">
          <img
            src={closeIcon}
            alt="Close Icon"
            className="dialog-close"
            onClick={() => CloseDialog()}
          />
          <div className="dialog-title">
            {selectedPool && (
              <div className="logo-container">
                <img
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', marginRight: '5px' }}
                  src={eap?.underlyingLogo}
                  alt=""
                />
              </div>
            )}
            {eap?.underlyingSymbol}
          </div>
          <div className="seperator" />
          <Tab>
            <TabHeader tabChange={tabChange}>
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
      </div>
    ) : null;

  return ReactDOM.createPortal(dialog, dialogContainer);
};

export default PoolDialog;
