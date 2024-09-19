import styled from 'styled-components';

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
};
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ d }) => d};
  justify-content: ${({ j }) => j};
  align-items: ${({ a }) => a};
  width: ${({ w }) => w || '100%'};
  height: ${({ h }) => h || '100%'};
  flex: ${({ f }) => f};
  margin: ${({ m }) => m};
  padding: ${({ p }) => p};
  border: ${({ b }) => b};
  border-radius: ${({ br }) => br};
  background-color: ${({ bg }) => bg};
`;

export const Block = styled.div<{ borderColor?: string }>`
  bottom: 0;
  padding: 10px;
  margin: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  background-color: #fff;
  border-radius: 10px;
  border: ${({ borderColor }) => borderColor && `0.5px solid ${borderColor}`};
  box-shadow: 0px 7px 24px -11px rgba(0, 0, 0, 0.15);
`;
