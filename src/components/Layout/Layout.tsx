import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from 'src/components/Footer/Footer';
import { Header } from 'src/components/Header/Header';
import { StarsBg } from 'src/components/StarsBg/StarsBg';
import styled from 'styled-components';

const MainContent = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 8rem 1rem 0;
  margin: 0 auto;

  @media screen and (max-width: 1100px) {
    padding-top: 4rem;
  }
`;

export const Layout = () => {
  return (
    <>
      <StarsBg />
      <Header />
      <MainContent style={{ flexGrow: 1 }}>
        <Outlet />
      </MainContent>
      <Footer />
    </>
  );
};
