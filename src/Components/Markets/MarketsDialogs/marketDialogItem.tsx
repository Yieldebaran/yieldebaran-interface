import React from 'react';
import './dialogSection.css';
import Tippy from '@tippyjs/react';

interface Props {
  title: string;
  value: string;
  toolTipContent?: string;
  className?: string;
}

// <Tippy content={balance}>
//     <div>{balance}</div>
// </Tippy>

const MarketDialogItem: React.FC<Props> = (props: Props) => {
  return (
    <div className={`dialog-section ${props.className ? props.className : ''}`}>
      <div className="dialog-section-content">
          <div className="dialog-section-content-header">
            <span>{props.title}</span>
          </div>
        {props.toolTipContent ? (
          <Tippy content={props.toolTipContent}>
            <div className="dialog-section-content-value" style={{ margin: '0px 0px 0px 0px' }}>
              {props.value}
            </div>
          </Tippy>
        ) : (
          <div className="dialog-section-content-value" style={{ margin: '0px 0px 0px 0px' }}>
            {props.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDialogItem;
