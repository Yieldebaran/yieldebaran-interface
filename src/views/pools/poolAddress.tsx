import React from 'react';
import { useParams } from 'react-router-dom';
import { MainBlock } from 'src/Components/MainBlock/MainBlock';
import Wrapper from 'src/Components/Wrapper/wrapper';

export const PoolAddress = () => {
  const params = useParams();

  return (
    <Wrapper>
      <MainBlock>
        <p>{JSON.stringify(params)}</p>
        <div className="tab-header">
          <div className="tab-header-item active">Hello</div>
          <div className="tab-header-item">Hello</div>
        </div>
      </MainBlock>
    </Wrapper>
  );
};
