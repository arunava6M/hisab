'use client';
import styled, { keyframes } from 'styled-components';
import { getRandomColor } from '@utils/helper';
const flyArc = keyframes`
  0% {
    top: 45%;
  }
  30% {
    top: 25%;
  }
  40% {
    top: 30%;
  }
  50% {
    top: 35%
  }
  60% {
    top: 50%;
  }
  70% {
    top: 55%;
  }
  80% {
    top: 50%
  }
  100% {
    top: 45%;
  }
`;

const LoaderWrapper = styled.div`
  z-index: 1;
  font-size: 60px;
  height: 100px;
  width: 100%;
  top: 45%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Rec1 = styled.div`
  border-radius: 8px;
  height: 20px;
  width: 8px;
  background-color: ${getRandomColor(true)};
  border: 1px solid blue;
  position: absolute;
  left: 45%;
  animation: ${flyArc} 0.6s ease-in-out infinite;
`;

const Rec2 = styled(Rec1)`
  animation-delay: 0.5s;
  background-color: ${getRandomColor(true)};
  left: 50%;
`;
const Rec3 = styled(Rec1)`
  animation-delay: 0.9s;
  background-color: ${getRandomColor(true)};
  left: 55%;
`;
const Loading = () => (
  <LoaderWrapper>
    <Rec1 />
    <Rec2 />
    <Rec3 />
  </LoaderWrapper>
);

export default Loading;
