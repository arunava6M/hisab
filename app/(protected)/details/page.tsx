'use client';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Block, Dialog, Flex } from '@atoms/Basic';
import { Text } from '@atoms/Text';
import Image from 'next/image';
import {
  editCategory,
  getAggregatedExpenses,
  getReport,
  shareCategory,
} from '@utils/api';
import { Input } from '@atoms/Input';
import { useRouter } from 'next/navigation';
import { AggregatedCategory } from '../../utils/commonTypes';
import { MemoizedUserList } from '@atoms/UserList';
import {
  genericCatch,
  getAuthToken,
  getColorFromValue,
  getMonthOptions,
} from '@utils/helper';
import { Button } from '@atoms/Button';
import BarDetails from '@molecules/BarDetails/BarDetails';
import DateRangeFilter from '@molecules/MonthPicker/MonthPicker';
import Loading from '@atoms/loading';
import { QUICK_SELECT_OPTIONS } from '@molecules/MonthPicker/QuickRangeView';

const Page = () => {
  const [categories, setCategories] = useState<AggregatedCategory[]>();
  const [expand, setExpand] = useState<number | null>(null);
  const router = useRouter();
  const [shareEmail, setShareEmail] = useState('');
  const [authToken, setAuthToken] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportDisaply, setReportDisplay] = useState<string>(
    QUICK_SELECT_OPTIONS.thismonth
  );

  useEffect(() => {
    requestReport();
  }, []);

  const requestReport = async (startDate?: Date, endDate?: Date) => {
    setLoading(true);
    const authToken = getAuthToken();
    try {
      const monthWiseResponse = await getReport(authToken, {
        startDate,
        endDate,
      });
      console.log(monthWiseResponse.data);
      setCategories(monthWiseResponse.data);
      setAuthToken(authToken);
    } catch (error: any) {
      genericCatch(error, router);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  if (!categories) return null;

  const editCategoryReq = async (id: string) => {
    try {
      const response = await editCategory(authToken, id, {
        sharedBetween: shareEmail,
      });
      console.log(response?.data);
    } catch (error) {
      // genericCatch(error);
    }
  };

  const shareEmailHandler = async (id: string) => {
    if (shareEmail === '') return null;
    await shareCategory(authToken, id, {
      shareEmail,
      action: 'add',
    });
  };

  const expandBlock = (id: number) =>
    typeof expand === 'number' ? setExpand(null) : setExpand(id);

  return (
    <PageWrapper>
      <DetailsContainer>
        <Flex o="scroll" j="center" a="center">
          {/* {getMonthOptions().map((each, index) => (
            <Fragment key={index}>
              <ReportButtons
                margin="0 5px"
                name={each.name}
                onClick={() => getReportUtility(...(each.number || []))}
                variant="secondary"
              />
            </Fragment>
          ))} */}
          <Text>Viewing: </Text>
          <ReportButtons
            margin="0 5px"
            name={`${reportDisaply} ⏷`}
            onClick={() => setIsModalOpen(true)}
          />
        </Flex>
        {categories.length == 0 ? (
          <EmptyContent>Nada for this period !</EmptyContent>
        ) : (
          categories.map(
            (
              { icon, description, total, budget, categoryId, sharedBetween },
              index
            ) => {
              const floatPercentageSpent = parseFloat(
                ((Number(total) / Number(budget)) * 100).toFixed(2)
              );
              const colorBar = getColorFromValue(floatPercentageSpent);

              return (
                <Block
                  height="fit-content"
                  key={index}
                  onClick={() => expandBlock(index)}
                >
                  <BarDetails
                    icon={icon}
                    description={description}
                    spent={total}
                    budget={budget}
                  />
                  <Flex
                    j="space-between"
                    a="center"
                    w="100%"
                    minH="40px"
                    h="40px"
                  >
                    <Flex br="10px" p="3px 20px" a="center" j="start">
                      <Flex
                        bg="#fac457"
                        j="center"
                        a="center"
                        h="30px"
                        w="30px"
                        br="50%"
                      >
                        ✔️
                      </Flex>
                      <Flex m="10px" a="center" w="auto">
                        <Text
                          color="green"
                          variant="smallBold"
                        >{`₹${Math.max(0, parseFloat(budget) - parseFloat(total)) | 0}`}</Text>
                      </Flex>
                    </Flex>
                    <Flex j="flex-end" m="0 10px" a="center">
                      <Flex j="center" a="center" h="30px" w="30px">
                        💸
                      </Flex>
                      <Text
                        variant="smallBold"
                        color="red"
                      >{`₹${parseFloat(total) | 0}`}</Text>
                    </Flex>
                  </Flex>
                  <Rotate
                    expanded={expand === index}
                    m="10px"
                    a="center"
                    j="center"
                    minH="10px"
                    h="10px"
                  >
                    <Image
                      height={20}
                      width={25}
                      src="/icon/down.png"
                      alt="Add icon"
                    />
                  </Rotate>
                  {expand === index && (
                    <Flex d="column">
                      <Block bordercolor="#c8c2c2">
                        <Text variant="small">{`💰 Budget: ₹${parseFloat(budget)}`}</Text>
                        <Text variant="small">{`💸 Spent: ₹${parseFloat(total)}`}</Text>
                        <Text variant="small">{`✅ Left: ₹${Math.max(0, parseFloat(budget) - parseFloat(total)) | 0}`}</Text>
                      </Block>
                      {sharedBetween.length > 1 && (
                        <Text variant="light">
                          This category is shared between:
                          {sharedBetween.map((each, index) => (
                            <span
                              key={index}
                            >{`${index === 0 ? ' ' : ', '}${each.name}`}</span>
                          ))}
                        </Text>
                      )}
                      <Flex
                        a="center"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        m="10px 0 0 0"
                      >
                        <Text color="green" variant="small">
                          Share:
                        </Text>
                        <Input
                          onChange={(e) => {
                            e.preventDefault();
                            setShareEmail(e.target.value);
                          }}
                          value={shareEmail}
                          margin="10px"
                          type="text"
                          placeholder={'Email of the user'}
                          height="auto"
                        />
                        <Image
                          height={15}
                          width={15}
                          src="/icon/paper-plane.png"
                          alt="Add icon"
                          onClick={() => shareEmailHandler(categoryId)}
                        />
                      </Flex>
                    </Flex>
                  )}
                </Block>
              );
            }
          )
        )}
      </DetailsContainer>
      <DateRangeFilter
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={({ startDate, endDate, displayText }) => {
          console.log('date applied range: ', startDate, endDate, displayText);
          setIsModalOpen(false);
          setReportDisplay(displayText);
          requestReport(startDate, endDate);
        }}
      />
    </PageWrapper>
  );
};

const ReportButtons = styled(Button)`
  max-width: fit-content;
`;

const EmptyContent = styled.div`
  height: 300px;
  width: 300px;
  border-radius: 8px;
  margin: 30px;
  text-align: center;
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailsContainer = styled.div`
  margin: 100px 20px;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #cccbc8;
  margin: 0 0 20px;
`;

const Percentage = styled.div`
  margin-left: 20px;
`;
const Rotate = styled(Flex)<{ expanded: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ expanded }) => expanded && 'rotate(180deg)'};
`;

const ShareEmailInput = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: black;
  box-shadow: 0px 0px 19px -3px rgba(0, 0, 0, 0.37);
`;

export default Page;
