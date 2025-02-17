import Tippy from '@tippyjs/react';
import React from 'react';
import 'src/components/modals/PoolModal/PoolModalRow.css';

interface Props {
  title: string;
  value: string;
  toolTipContent?: string;
  className?: string;
}

export const PoolModalRow: React.FC<Props> = (props: Props) => {
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
