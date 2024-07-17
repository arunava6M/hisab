import styled, { css } from 'styled-components';

export interface StyledButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: string;
  variant?: 'circle' | 'primary' | 'secondary';
  margin?: string;
  className?: string;
  error?: boolean;
  border?: string;
}
interface ButtonProps extends StyledButtonProps {
  name: string;
}
const buttonVariants = {
  circle: css`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    padding: 0;
  `,
  primary: css`
    width: auto;
    min-width: 60px;
    color: white;
  `,
  secondary: css`
    width: auto;
    background-color: inherit;
    padding: 10px;
  `,
};
const StyledButton = styled.button<StyledButtonProps>`
  right: 0;
  padding: 10px 20px;
  border-radius: 20px;
  border: ${({ error, border }) => {
    if (error) return '2px solid red';
    if (border) return border;
    return 'none';
  }};
  outline: none;
  background-color: cadetblue;
  color: black;
  margin: ${({ margin }) => margin};
  ${({ variant = 'primary' }) =>
    buttonVariants[variant] || buttonVariants.primary};
`;

export const Button = ({
  name,
  onClick,
  type,
  variant,
  margin,
  className,
  error,
  border,
}: ButtonProps) => (
  <StyledButton
    className={className}
    variant={variant}
    type={type}
    onClick={onClick}
    margin={margin}
    error={error}
    border={border}
  >
    {name}
  </StyledButton>
);
