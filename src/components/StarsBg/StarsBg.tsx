import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import './style.css';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function multiplyBoxShadow(n: number, windowSize: number) {
  let val = `${getRandomInt(windowSize < 1000 ? 1000 : windowSize)}px ${getRandomInt(
    windowSize < 1000 ? 1000 : windowSize,
  )}px #fff`;

  for (let i = 2; i < n; i++) {
    val = `${val}, ${getRandomInt(windowSize < 1000 ? 1000 : windowSize)}px ${getRandomInt(
      windowSize < 1000 ? 1000 : windowSize,
    )}px #fff`;
  }

  return val;
}

// const shadows = [multiplyBoxShadow(700), multiplyBoxShadow(200), multiplyBoxShadow(100)];

const Stars = styled.div`
  position: fixed;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
`;

const animStar = keyframes`
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
`;

const Star = styled.div<{
  index: number;
  size: number;
  windowSize: { height: number; width: number };
}>`
  width: ${(p) => p.index}px;
  height: ${(p) => p.index}px;
  background: transparent;
  animation: ${animStar} ${(p) => 50 * p.index}s linear infinite;
  box-shadow: ${(p) => multiplyBoxShadow(p.size, p.windowSize.width)};
  :after {
    content: ' ';
    position: absolute;
    top: ${(p) => p.windowSize.height}px;
    width: ${(p) => p.index}px;
    height: ${(p) => p.index}px;
    background: transparent;
    box-shadow: ${(p) => multiplyBoxShadow(p.size, p.windowSize.width)};
  }
`;

export const StarsBg = () => {
  const [windowSize, setWindowSize] = useState({
    height: document.body.clientHeight,
    width: document.body.clientWidth,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        height: document.body.clientHeight,
        width: document.body.clientWidth,
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <Stars>
      <Star index={1} size={700} windowSize={windowSize} />
      <Star index={2} size={200} windowSize={windowSize} />
      <Star index={3} size={100} windowSize={windowSize} />
    </Stars>
  );
};
