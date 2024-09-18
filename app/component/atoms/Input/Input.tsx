import styled from 'styled-components';

interface InputProps {
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  placeholder?: string;
  type?: string;
  height?: string;
  variant?: string;
  margin?: string;
  error?: boolean;
}
const StyledInput = styled.input<InputProps>`
  width: ${({ width }) => width || '100%'};
  font-size: 12px;
  height: ${({ height }) => height || '60px'};
  margin: ${({ margin }) => margin};
  padding: 10px;
  outline: none;
  border: ${({ error }) => (error ? '2px solid red' : 'none')};
  border-radius: ${({ variant }) => (variant === 'smiley' ? '50%' : '10px')};
  background: #f0f0f0;
  color: black;
  &:focus {
    outline: none;
  }
`;

export const Input = ({
  value,
  onChange,
  width,
  placeholder,
  type,
  height,
  variant,
  margin,
  error,
}: InputProps) => {
  return (
    <StyledInput
      variant={variant}
      height={height}
      type={type}
      width={width}
      margin={margin}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};
