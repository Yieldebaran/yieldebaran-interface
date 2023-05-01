import styled from 'styled-components';

export const UiTabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  font-size: 1.5rem;
  margin: 1rem 0 2rem;
  @media screen and (max-width: 500px) {
    font-size: 1rem;
  }
`;

export const UiTab = styled.div`
  padding: 0.4rem 1.2rem;
  text-decoration: none;
  cursor: pointer;
  @media screen and (max-width: 500px) {
    padding: 0.4rem 0.5rem;
  }
  &:hover {
    text-decoration: underline;
  }
  &.active {
    text-decoration: underline;
  }
`;
