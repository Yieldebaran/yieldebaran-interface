import React, { PropsWithChildren } from 'react';
import './main-block.css';

export const MainBlock: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="main-block">{children}</div>;
};
