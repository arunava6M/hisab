import styled from "styled-components";

type FlexProps = {
  d?: string;
  j?: string;
  a?: string;
  w?: string;
  h?: string;
}
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({d}) => d};
  justify-content: ${({j})=> j};
  align-items: ${({a})=> a};
  width: ${({w})=> w || '100%'};
  height: ${({h})=> h || '100%'};
`