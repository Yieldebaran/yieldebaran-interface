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
      </MainBlock>
    </Wrapper>
  );
};
