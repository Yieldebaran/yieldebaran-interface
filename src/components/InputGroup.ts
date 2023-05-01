import { StyledButton } from 'src/components/Button/button';
import styled from 'styled-components';

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
  margin-top: 1.5rem;
  ${StyledButton} {
    margin-top: 1rem;
  }
  @media screen and (max-width: 500px) {
    flex-direction: column;
    gap: 1rem;
    ${StyledButton} {
      margin-top: 0;
      margin-left: auto;
    }
  }
`;
