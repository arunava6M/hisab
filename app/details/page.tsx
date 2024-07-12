
'use client'
import React, { useEffect, useState } from "react";
import ProgressBar from "./progressBar";
import {PageWrapper} from '../page';
import styled from "styled-components";
import { db } from '../../firebase/config';
import { useAuthContext } from "../../context/authContext";
import {collection, onSnapshot} from "firebase/firestore";
import {SignOut} from '../page'
import { useRouter } from "next/navigation";

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 20px;
`

const DetailsContainer = styled.div`
  margin: 100px 20px 20px 20px;
`

const Percentage = styled.div`
  margin-left: auto
`

const Page = () => {
  const {user} =useAuthContext()
  const [tags, setTags] = useState([])
  const router = useRouter()


  useEffect(() => {
    if(user){
      const tagCollectionRef = collection( db, 'users', user?.uid, 'tag')
      const tagsArray: Array<{[key: string]: string}> = [];
      const tagUnsubscribe = onSnapshot(tagCollectionRef, querySnapshot => {
        querySnapshot.forEach((doc) => {
          
          tagsArray.push({ id: doc.id, ...doc.data() });
        });
        console.log(tagsArray)
        setTags(tagsArray)
      })
      return () => {
        tagUnsubscribe();
      }
    }
  
  }, []);

  console.log(tags)

  const assignColor = (value) => {
    let finalColor;
    switch (true) {
      case (value === 50):
        console.log('goo')
        finalColor =  'green';
        break;
      case (value > 50 && value < 65):
        finalColor = 'blue';
        break;
      case (value > 65):
        finalColor = 'red';
        break;
    }
    return finalColor;
  }

  // const getIconForCategories = (category) => {
  //   switch(true){
  //     case "Vegetables":
  //       return "";
  //     case "Groceries":
  //       return "";
  //   }
  // }

  const detailsData = [
    {
      categoryName: "Vegetables",
      categoryIcon: "🍀",
      budgetAllocated: 2000,
      spendTillNow: 1000
    },
    {
      categoryName: "Groceries",
      categoryIcon: "🍲",
      budgetAllocated: 5000,
      spendTillNow: 4000
    }
  ]
  
  return (
    <PageWrapper>
      <SignOut onClick={() => router.back() }>◀️</SignOut>
      <DetailsContainer>
        {tags.map((e,index)=>{
          const percentageSpend = e.spent/e.budget*100;
          const colorBar = assignColor(percentageSpend);

          return (
            <DetailsWrapper key={index}>
              <span>{e.tag}</span>
              <ProgressBar
                key={index}
                height={10}
                progress={percentageSpend}
                progressColor={colorBar}
              />
              <Percentage>{percentageSpend}<span>%</span></Percentage>
            </DetailsWrapper>
          )
        })}
      </DetailsContainer>
    </PageWrapper>

  );
}

export default Page;