import { Button } from '@atoms/Button';
import styled, { keyframes } from 'styled-components';

type FlexProps = {
  d?: string;
  j?: string;
  a?: string;
  w?: string;
  h?: string;
  f?: string;
  m?: string;
  p?: string;
  b?: string;
  br?: string;
  bg?: string;
  minH?: string;
  o?: string;
  fw?: string;
};
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ d }) => d};
  justify-content: ${({ j }) => j};
  align-items: ${({ a }) => a};
  width: ${({ w }) => w || '100%'};
  height: ${({ h }) => h || '100%'};
  min-height: ${({ minH }) => minH};
  flex: ${({ f }) => f};
  margin: ${({ m }) => m};
  padding: ${({ p }) => p};
  border: ${({ b }) => b};
  border-radius: ${({ br }) => br};
  background-color: ${({ bg }) => bg};
  overflow: ${({ o }) => o || 'hidden'};
  flex-wrap: ${({ fw }) => fw || 'nowrap'};
`;

const OpactiyAnimation = keyframes`
  0% { opacity: 0}
  100% {opactiy: 100}
`;

export const Block = styled.div<{ bordercolor?: string; height?: string }>`
  bottom: 0;
  padding: 10px;
  margin: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  height: ${({ height }) => height || 'auto'};
  background-color: #fff;
  border-radius: 10px;
  border: ${({ bordercolor }) => bordercolor && `0.5px solid ${bordercolor}`};
  box-shadow: 0px 7px 24px -11px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  animation-name: ${OpactiyAnimation};
  animation-duration: 0.5s;
`;

export const Dialog = styled.dialog`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
  margin: 5px 0;
  height: 50px;
`;
