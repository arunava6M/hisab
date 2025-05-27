'use client';
import React, { useEffect, useState } from 'react';
import ProgressBar from './progressBar';
import styled from 'styled-components';
import { Block, Flex } from '../../component/atoms/Basic';
import { Text } from '../../component/atoms/Text';
import Image from 'next/image';
import {
  editCategory,
  getAggregatedExpenses,
  shareCategory,
} from '../../utils/api';
import { Input } from '../../component/atoms/Input';
import Cookies from 'js-cookie';
import { redirect, useRouter } from 'next/navigation';
import { AggregatedCategory, ErrorType } from '../../utils/commonTypes';
import { MemoizedUserList } from '../../component/atoms/UserList';
import { useAuthContext } from '../../../context/authContext';
import { getColorFromValue } from '../../utils/helper';

const Page = () => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState<AggregatedCategory[]>();
  const [expand, setExpand] = useState<number | null>(null);
  const router = useRouter();
  const [shareEmail, setShareEmail] = useState('');
  const [authToken, setAuthToken] = useState<string>();

  useEffect(() => {
    const fetchApis = async () => {
      const auth_token = Cookies.get('authToken');
      if (!auth_token) {
        router.push('/signin');
      }
      try {
        const response = await getAggregatedExpenses(auth_token);
        setCategories(response.data);
        setAuthToken(auth_token);
      } catch (error: any) {
        if (error.response.data.details === 'jwt expired') {
          router.push('/signin');
        }
      }
    };

    fetchApis();
  }, []);

  if (!categories) return null;

  const editCategoryReq = async (id: string) => {
    try {
      const response = await editCategory(authToken, id, {
        sharedWith: shareEmail,
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
      {/* <SignOut onClick={() => router.back()}>◀️</SignOut> */}
      <DetailsContainer>
        {categories.length == 0 ? (
          <EmptyContent>You have not done any Hisab yet !</EmptyContent>
        ) : (
          categories.map(
            (
              { icon, description, total, budget, categoryId, sharedWith },
              index
            ) => {
              const floatPercentageSpent = parseFloat(
                ((Number(total) / Number(budget)) * 100).toFixed(2)
              );
              const colorBar = getColorFromValue(floatPercentageSpent);

              return (
                <Block
                  height={expand === index ? '210px' : '145px'}
                  key={index}
                  onClick={() => expandBlock(index)}
                >
                  <Flex j="flex-start" a="center" minH="35px" h="35px">
                    <Flex
                      m="0 10px 0 0"
                      w="auto"
                      b="1px solid #c2c2c2"
                      br="10px"
                      p="5px"
                    >
                      {icon}
                    </Flex>
                    {sharedWith.length > 0 && (
                      <MemoizedUserList
                        list={[{ name: user?.firstName }, ...sharedWith]}
                      />
                    )}
                    <Flex f="3">
                      <Text variant="bold">{description}</Text>
                    </Flex>
                    <Percentage>
                      <Text variant="bold">
                        {floatPercentageSpent || 0}
                        <span>%</span>
                      </Text>
                    </Percentage>
                  </Flex>
                  <Flex m="10px 0" minH="10px" h="10px">
                    <ProgressBar
                      key={index}
                      height={2}
                      progress={floatPercentageSpent}
                      progressColor={colorBar}
                    />
                  </Flex>
                  <Flex
                    j="space-between"
                    a="center"
                    w="100%"
                    minH="40px"
                    h="40px"
                  >
                    <Flex br="10px" p="3px 20px" a="center" j="space-between">
                      <Image
                        height={25}
                        width={25}
                        src="/icon/money-bag.png"
                        alt="Add icon"
                      />
                      <Flex m="10px" a="center">
                        <Text
                          color="green"
                          variant="smallBold"
                        >{`₹${Math.max(0, parseFloat(budget) - parseFloat(total)) | 0}`}</Text>
                      </Flex>
                    </Flex>
                    <Flex j="flex-end" m="0 10px" a="center">
                      <Text
                        variant="smallBold"
                        color="red"
                      >{`- ₹${parseFloat(total) | 0}`}</Text>
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
                    <Flex
                      a="center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
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
                  )}
                </Block>
              );
            }
          )
        )}
      </DetailsContainer>
    </PageWrapper>
  );
};

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
  margin: 80px 20px;
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
