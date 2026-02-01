import { Flex, FullWidthButton } from '@atoms/Basic';
import { Button } from '@atoms/Button';
import { Input } from '@atoms/Input';
import { Text } from '@atoms/Text';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface MonthRangeViewProps {
  onApply: (value: string) => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = [2025, 2024, 2023, 2022];

export const MonthRangeView: React.FC<MonthRangeViewProps> = ({ onApply }) => {
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    const now = new Date();
    const monthNum = now.getMonth() + 1;
    const yearNum = now.getFullYear();
    setMonth(monthNum);
    setYear(yearNum);
  }, []);

  return (
    <Flex fw="wrap">
      <Flex d="column" h="max-content">
        <Text variant="small">Month</Text>
        <Select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTHS.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex d="column" h="max-content">
        <Text variant="small">Year</Text>
        <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {YEARS.map((year, index) => (
            <option key={index} value={index}>
              {year}
            </option>
          ))}
        </Select>
      </Flex>
      <FullWidthButton
        name="Apply"
        onClick={() => onApply(`${month},${year}`)}
      />
    </Flex>
  );
};

const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  border: none;
  outline: none;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background-color: #dadfdd;
  color: black;

  &:focus {
    border: 2px solid #3b82f6;
  }
`;
