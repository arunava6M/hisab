'use client'
import React from "react";
import styled from "styled-components";
import {red} from "next/dist/lib/picocolors";

const ParentDiv = styled.div`
  height: ${(props) => (props.height ? props.height : 30)}px;
  width: 100%;
  background-color: whitesmoke;
  border-radius: 40px;
`

const ChildDiv = styled.div`
  height: 100%;
  width: ${(props) => (props.progress ? props.progress : 0)}%;
  background-color: ${(props)=>(props.progressColor ? props.progressColor: 'red')};
  border-radius: 40px;
  text-align: right;
  margin-left: 10px;
`


function ProgressBar({height, progress,progressColor}) {
  return (
    <ParentDiv height={height}>
      <ChildDiv progress={progress} progressColor={progressColor}>
      </ChildDiv>
    </ParentDiv>
  );
}

export default ProgressBar;