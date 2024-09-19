import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

type TextProps = {
  children: ReactNode;
  variant?: 'regular' | 'bold' | 'light' | 'small' | 'smallBold';
  color?: string;
};
const Styled = styled.p<{ variant: string }>`
  ${({ variant, color }) => {
    const common = css`
      color: ${color};
    `;
    let variantSpecific = css``;
    switch (variant) {
      case 'regular':
        variantSpecific = css`
          font-size: 16px;
          font-weight: 400;
        `;
        break;
      case 'bold':
        variantSpecific = css`
          font-size: 17px;
          font-weight: 500;
        `;
        break;
      case 'small':
        variantSpecific = css`
          font-size: 14px;
          font-weight: 400;
        `;
        break;
      case 'smallBold':
        variantSpecific = css`
          font-size: 14px;
          font-weight: 500;
        `;
        break;
      case 'light':
        variantSpecific = css`
          font-size: 14px;
          font-weight: 200;
          color: grey;
        `;
        break;
      default:
        variantSpecific = css`
          font-size: 16px;
          font-weight: 400;
        `;
    }
    return css`
      ${variantSpecific}
      ${common}
    `;
  }}
`;

export const Text = ({ children, variant = 'regular', color }: TextProps) => (
  <Styled variant={variant} color={color}>
    {children}
  </Styled>
);
