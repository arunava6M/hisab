import { Dialog } from '@atoms/Basic';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Flex } from '../../atoms/Basic';
import { Button } from '@atoms/Button';
import { QUICK_SELECT_OPTIONS, QuickRangeView } from './QuickRangeView';
import { MonthRangeView } from './MonthRangeView';

// Define the shape of the data that the component will output
interface DateRange {
  startDate: Date;
  endDate: Date;
  displayText: string;
}

interface DateRangeFilterProps {
  onApply: (range: DateRange) => void;
  onClose: () => void;
  isOpen: boolean;
}

const RANGE_MODE = {
  QUICK: 'QUICK',
  MONTH: 'MONTH',
  CUSTOM: 'CUSTOM',
} as const;

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

const calculateDateRange = (
  type: keyof typeof RANGE_MODE,
  value: string
): DateRange => {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of current month by default

  console.log(QUICK_SELECT_OPTIONS.thismonth);
  if (type === RANGE_MODE.QUICK) {
    if (value === QUICK_SELECT_OPTIONS.thismonth) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (value === QUICK_SELECT_OPTIONS.last30days) {
      startDate.setDate(today.getDate() - 30);
      endDate = today;
    } else if (value === QUICK_SELECT_OPTIONS.last3months) {
      startDate.setMonth(today.getMonth() - 2);
      startDate.setDate(1);
    } else if (value === QUICK_SELECT_OPTIONS.thisyear) {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else if (value === QUICK_SELECT_OPTIONS.lastyear) {
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
    }
  } else if (type === RANGE_MODE.MONTH) {
    const [monthIndex, year] = value.split(',').map(Number);
    startDate = new Date(year, monthIndex, 1);
    endDate = new Date(year, monthIndex + 1, 0);
  } else if (type === RANGE_MODE.CUSTOM) {
    const [sM, sY, eM, eY] = value.split(',').map(Number);
    startDate = new Date(sY, sM, 1);
    endDate = new Date(eY, eM + 1, 0);
  }

  // Ensure end date is set to the very end of the day for filtering
  endDate.setHours(23, 59, 59, 999);

  // Generate display text
  const display = formatDateDisplay(startDate, endDate);

  return { startDate, endDate, displayText: display };
};

const formatDateDisplay = (startDate: Date, endDate: Date): string => {
  const sMonthName = MONTHS[startDate.getMonth()];
  const sYear = startDate.getFullYear();
  const eMonthName = MONTHS[endDate.getMonth()];
  const eYear = endDate.getFullYear();

  if (sYear === eYear && startDate.getMonth() === endDate.getMonth()) {
    return `${sMonthName} ${sYear}`;
  }
  return `${sMonthName.substring(0, 3)} ${sYear} - ${eMonthName.substring(0, 3)} ${eYear}`;
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onApply,
  onClose,
  isOpen,
}) => {
  const [rangeMode, setRangeMode] = useState<keyof typeof RANGE_MODE>(
    RANGE_MODE.QUICK
  );

  const handleApply = (value: string) => {
    let range: DateRange;

    try {
      if (rangeMode === RANGE_MODE.QUICK) {
        range = calculateDateRange(RANGE_MODE.QUICK, value);
      } else if (rangeMode === RANGE_MODE.MONTH) {
        range = calculateDateRange(RANGE_MODE.MONTH, value);
      } else {
        range = calculateDateRange(RANGE_MODE.CUSTOM, value);
      }
      onApply(range);
    } catch (error) {
      console.error('Error calculating date range:', error);
    }
  };

  const rangeView = () => {
    switch (rangeMode) {
      case RANGE_MODE.QUICK:
        return <QuickRangeView onApply={handleApply} />;
      case RANGE_MODE.MONTH:
        return <MonthRangeView onApply={handleApply} />;
      case RANGE_MODE.CUSTOM:
        return <div>Custom</div>;
      default:
        return <div>Quick</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <DialogContent>
        <Flex j="space-between" a="center" m="0 0 10px 0" h="30px">
          <h4> Select date range</h4>
          <Button variant="secondary" onClick={onClose} name="❌" />
        </Flex>
        <Flex m="0 0 15px 0" bg="#dadfdd" br="8px" p="5px" h="50px" w="auto">
          <Button
            padding="0"
            margin="0"
            onClick={() => setRangeMode(RANGE_MODE.QUICK)}
            name="Quick"
            variant={
              rangeMode === RANGE_MODE.QUICK ? 'primary' : 'primary_toggle'
            }
          />
          <Button
            margin="0"
            onClick={() => setRangeMode(RANGE_MODE.MONTH)}
            name="Month"
            variant={
              rangeMode === RANGE_MODE.MONTH ? 'primary' : 'primary_toggle'
            }
          />
          {/* <Button
            margin="0"
            onClick={() => setRangeMode(RANGE_MODE.CUSTOM)}
            name="Custom"
            variant={
              rangeMode === RANGE_MODE.CUSTOM ? 'primary' : 'primary_toggle'
            }
          /> */}
        </Flex>
        <Flex h="200px">{rangeView()}</Flex>
      </DialogContent>
    </Dialog>
  );
};

const DialogContent = styled.div`
  background-color: white;
  max-width: 70%;
  margin: auto;
  padding: 20px;
  border-radius: 15px;
  color: black;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export default DateRangeFilter;
