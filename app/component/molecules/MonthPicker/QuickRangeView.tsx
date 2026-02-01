import { Flex, FullWidthButton } from '@atoms/Basic';
import { Button } from '@atoms/Button';
import { useState } from 'react';

export const QUICK_SELECT_OPTIONS: { [key: string]: string } = {
  thismonth: 'This month',
  last30days: 'Last 30 days',
  last3months: 'Last 3 months',
  thisyear: 'This year',
  lastyear: 'Last year',
};

interface QuickRangeViewProps {
  onApply: (option: string) => void;
}

export const QuickRangeView: React.FC<QuickRangeViewProps> = ({ onApply }) => {
  const [option, setOption] = useState<string>(QUICK_SELECT_OPTIONS.thismonth);
  return (
    <Flex fw="wrap">
      {Object.entries(QUICK_SELECT_OPTIONS).map(([key, value]) => (
        <Button
          key={key}
          margin="5px"
          onClick={() => {
            setOption(value);
          }}
          name={value}
          variant={option === value ? 'primary' : 'primary_toggle'}
        />
      ))}
      <FullWidthButton name="Apply" onClick={() => onApply(option)} />
    </Flex>
  );
};
