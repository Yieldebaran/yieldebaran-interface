import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  padding: 2rem 1rem;
  @media screen and (max-width: 500px) {
    flex-wrap: wrap;
    white-space: nowrap;
  }
  a {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
    @media screen and (max-width: 500px) {
      margin-top: 1rem;
    }
    :hover {
      text-decoration: underline;
    }
    :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <a
        href="https://github.com/yieldebaran/yieldebaran-interface"
        target={'_blank'}
        rel={'noreferrer'}
      >
        Interface repo
      </a>
      <a
        href="https://github.com/yieldebaran/yieldebaran-contracts"
        target={'_blank'}
        rel={'noreferrer'}
      >
        Contracts repo
      </a>
      <a
        href="https://github.com/Yieldebaran/yieldebaran-contracts/blob/master/DEPLOYMENT_INFO.md"
        target={'_blank'}
        rel={'noreferrer'}
      >
        Deployment info
      </a>
      <a href="https://linktr.ee/yieldebaran" target={'_blank'} rel={'noreferrer'}>
        Community
      </a>
    </StyledFooter>
  );
};
