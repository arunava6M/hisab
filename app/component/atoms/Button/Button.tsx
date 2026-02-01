import styled, { css } from 'styled-components';

export interface StyledButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: string;
  variant?: 'circle' | 'primary' | 'primary_toggle' | 'secondary';
  margin?: string;
  className?: string;
  error?: boolean;
  border?: string;
  bg?: string;
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
    background-color: cadetblue;
  `,
  primary: css`
    width: auto;
    min-width: 60px;
    color: white;
    background-color: cadetblue;
  `,
  primary_toggle: css`
    width: auto;
    min-width: 60px;
    background-color: transparent;
    color: black;
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
  border-radius: 8px;
  border: ${({ error, border }) => {
    if (error) return '2px solid red';
    if (border) return border;
    return 'none';
  }};
  outline: none;
  color: black;
  margin: ${({ margin }) => margin};
  ${({ variant = 'primary' }) =>
    buttonVariants[variant] || buttonVariants.primary};
  background-color: ${({ bg }) => bg};
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
  bg,
}: ButtonProps) => (
  <StyledButton
    className={className}
    variant={variant}
    type={type}
    onClick={onClick}
    margin={margin}
    error={error}
    border={border}
    bg={bg}
  >
    {name}
  </StyledButton>
);
