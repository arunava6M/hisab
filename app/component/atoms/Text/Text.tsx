import styled, { css } from 'styled-components';

type TextProps = {
  children: string;
  variant?: 'regular' | 'bold' | 'light';
};
const Styled = styled.p<{ variant: string }>`
  ${({ variant }) => {
    switch (variant) {
      case 'regular':
        return css`
          font-size: 16px;
          font-weight: 400;
        `;
      case 'bold':
        return css`
          font-size: 17px;
          font-weight: 500;
        `;
      case 'small':
        return css`
          font-size: 14px;
          font-weight: 400;
        `;
      case 'light':
        return css`
          font-size: 14px;
          font-weight: 200;
          color: grey;
        `;
      default:
        return css`
          font-size: 16px;
          font-weight: 400;
        `;
    }
  }}
`;

export const Text = ({ children, variant = 'regular' }: TextProps) => (
  <Styled variant={variant}>{children}</Styled>
);
