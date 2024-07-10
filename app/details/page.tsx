
'use client'
import React from "react";
import ProgressBar from "./progressBar";
import {PageWrapper} from '../page';
import styled from "styled-components";

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 20px;
`

const DetailsContainer = styled.div`
  margin: 20px;
`

const Percentage = styled.div`
  margin-left: auto
`

function Page() {

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

  const getIconForCategories = (category) => {
    switch(true){
      case "Vegetables":
        return "";
      case "Groceries":
        return "";
    }
  }

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
      <DetailsContainer>
        {detailsData.map((e,index)=>{
          const percentageSpend = e.spendTillNow/e.budgetAllocated*100;
          const colorBar = assignColor(percentageSpend);

          return (
            <DetailsWrapper key={index}>
              <span>{e.categoryIcon}</span>
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