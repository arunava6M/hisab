'use client';
import React, { useEffect, useState } from 'react';
import ProgressBar from './progressBar';
import { PageWrapper } from '../page';
import styled from 'styled-components';
import { db } from '../../firebase/config';
import { useAuthContext } from '../../context/authContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { SignOut } from '../page';
import { useRouter } from 'next/navigation';
import { Block, Flex } from '../component/atoms/Basic';
import { Text } from '../component/atoms/Text';
import Image from 'next/image';

const DetailsContainer = styled.div`
  margin: 20px;
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

const Page = () => {
  const { user } = useAuthContext();
  const [tags, setTags] = useState<Array<{ [key: string]: string }>>([]);
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (user) {
      const tagCollectionRef = collection(db, 'users', user?.uid, 'tag');
      const tagsArray: Array<{ [key: string]: string }> = [];
      const tagUnsubscribe = onSnapshot(tagCollectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { spent, budget } = doc.data();
          const percentage = ((Number(spent) / Number(budget)) * 100).toFixed(
            2
          );
          tagsArray.push({
            id: doc.id,
            percentageSpent: percentage,
            ...doc.data(),
          });
        });
        setTags(tagsArray);
      });
      return () => {
        tagUnsubscribe();
      };
    }
  }, []);

  const assignColor = (value: number) => {
    let finalColor;
    switch (true) {
      case value > 50 && value < 65:
        finalColor = '#e38424';
        break;
      case value > 65:
        finalColor = '#e32444';
        break;
      default:
        finalColor = 'green';
    }
    return finalColor;
  };

  console.log(tags);

  return (
    <PageWrapper>
      {/* <SignOut onClick={() => router.back()}>◀️</SignOut> */}
      <DetailsContainer>
        {tags.map(
          ({ tag, percentageSpent, description, spent, budget }, index) => {
            const floatPercentageSpent = parseFloat(percentageSpent);
            const colorBar = assignColor(floatPercentageSpent);

            return (
              <Block key={index}>
                <Flex j="flex-start" a="center">
                  <Flex
                    m="0 10px 0 0"
                    w="auto"
                    b="1px solid #c2c2c2"
                    br="10px"
                    p="5px"
                  >
                    {tag}
                  </Flex>
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
                <Flex m="10px 0">
                  <ProgressBar
                    key={index}
                    height={2}
                    progress={floatPercentageSpent}
                    progressColor={colorBar}
                  />
                </Flex>
                <Flex j="space-between" a="center" w="100%">
                  <Flex
                    // bg="#f7e4c6"
                    br="10px"
                    p="3px 20px"
                    a="center"
                    j="space-between"

                    // b={`1px solid ${getRandomColor()}`}
                  >
                    <Image
                      height={25}
                      width={25}
                      src="/icon/money-bag.png"
                      alt="Add icon"
                    />
                    <Flex m="10px">
                      <Text
                        color="green"
                        variant="smallBold"
                      >{`₹${Math.max(0, parseFloat(budget) - parseFloat(spent)) | 0}`}</Text>
                    </Flex>
                  </Flex>
                  <Flex j="flex-end" m="0 10px">
                    <Text
                      variant="smallBold"
                      color="red"
                    >{`- ₹${parseFloat(spent) | 0}`}</Text>
                  </Flex>
                </Flex>
              </Block>
            );
          }
        )}
      </DetailsContainer>
    </PageWrapper>
  );
};

export default Page;
