import React from 'react';
import styled from 'styled-components';
import './navbar.css';

const LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/yieldebaran/',
  },
] as const;

const StyledHeaderLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
`;

const HeaderLink = styled.li`
  position: relative;
  letter-spacing: 1px;
  display: inline-block;
  line-height: 60px;
  text-decoration: none;
  padding: 0 1rem;
  user-select: none;
  cursor: pointer;
  a {
    color: inherit;
    text-decoration: none;
  }
  &:hover {
    opacity: 0.7;
  }
`;

export const HeaderLinks = () => {
  return (
    <StyledHeaderLinks>
      {LINKS.map((link) => (
        <HeaderLink key={link.name}>
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.name}
          </a>
        </HeaderLink>
      ))}
    </StyledHeaderLinks>
  );
};
