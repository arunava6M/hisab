import styled from 'styled-components';
import { Block } from '../../atoms/Basic';
import { Text } from '../../atoms/Text';
import { getRandomColor } from '../../../utils/helper';
import { Fragment, useEffect } from 'react';
import React from 'react';

const AmtRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const DescriptionRow = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 5px 5px 5px 10px;
`;

const Amount = styled.div`
  bottom: 0;
  width: max-content;
  border-radius: 5px;
  margin-right: 5px;
  padding: 5px 10px;
`;

const Tag = styled.div`
  font-size: 20px;
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Line = styled.div`
  border-top: 1px solid grey;
  flex-grow: 1;
  margin: 0 10px;
`;

const ExpenseComp = ({ lastRef, expense, key, showDateLine }) => {
  const { amount, date: isoString, category } = expense;
  const readableDate = new Date(isoString);

  // useEffect(() => {
  //   if (lastRef?.current) {
  //     console.log('inside last expense ref');
  //     lastRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, []);

  return (
    <Fragment key={key}>
      {showDateLine && readableDate && (
        <DateLine>
          <Line />
          <Text variant="light">{readableDate.toLocaleDateString()}</Text>
          <Line />
        </DateLine>
      )}
      <Block ref={lastRef} borderColor={getRandomColor()}>
        <AmtRow>
          <Tag>{category.icon}</Tag>
          <DescriptionRow>
            <Text variant="small">{category.name}</Text>
            <Text variant="light">{readableDate.toLocaleTimeString()}</Text>
          </DescriptionRow>
          <Amount>
            <Text variant="bold">{`₹ ${amount}`}</Text>
          </Amount>
        </AmtRow>
      </Block>
    </Fragment>
  );
};

export const Expense = React.memo(ExpenseComp);
