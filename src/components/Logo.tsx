import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled(Link)`
  font-size: 3rem;
  text-decoration: none;
  color: inherit;
  @media screen and (max-width: 500px) {
    font-size: 2rem;
    margin-right: auto;
  }
`;

export const Logo = () => {
  return <StyledLogo to="/">Yieldebaran</StyledLogo>;
};
