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

const DetailsContainer = styled.div`
  margin: 100px 20px 20px 20px;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #cccbc8;
  margin: 0 0 20px;
`;

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Percentage = styled.div`
  margin-left: 20px;
`;

const Page = () => {
  const { user } = useAuthContext();
  const [tags, setTags] = useState<Array<{ [key: string]: string }>>([]);
  const router = useRouter();

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
        finalColor = 'blue';
        break;
      case value > 65:
        finalColor = 'red';
        break;
      default:
        finalColor = 'green';
    }
    return finalColor;
  };

  return (
    <PageWrapper>
      <SignOut onClick={() => router.back()}>◀️</SignOut>
      <DetailsContainer>
        {tags.map(({ tag, percentageSpent, description }, index) => {
          const floatPercentageSpent = parseFloat(percentageSpent);
          const colorBar = assignColor(floatPercentageSpent);

          return (
            <RowWrapper key={index}>
              {description}
              <DetailsWrapper>
                <span>{tag}</span>
                <ProgressBar
                  key={index}
                  height={10}
                  progress={floatPercentageSpent}
                  progressColor={colorBar}
                />
                <Percentage>
                  {floatPercentageSpent || 0}
                  <span>%</span>
                </Percentage>
              </DetailsWrapper>
            </RowWrapper>
          );
        })}
      </DetailsContainer>
    </PageWrapper>
  );
};

export default Page;
