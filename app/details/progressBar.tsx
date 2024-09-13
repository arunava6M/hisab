'use client';
import React from 'react';
import styled from 'styled-components';

const ParentDiv = styled.div<{ height?: number }>`
  height: ${(props) => (props.height ? props.height : 30)}px;
  width: 100%;
  background-color: whitesmoke;
  border-radius: 40px;
`;

const ChildDiv = styled.div<{ progress: number; progressColor: string }>`
  height: 100%;
  width: ${({ progress }) => {
    if (!progress) return '0%';
    if (progress > 100) {
      return '100%';
    }
    return `${progress}%`;
  }};
  background-color: ${(props) =>
    props.progressColor ? props.progressColor : 'red'};
  border-radius: 40px;
  text-align: right;
  margin-left: 10px;
`;

const ProgressBar = ({
  height,
  progress,
  progressColor,
}: {
  height: number;
  progress: number;
  progressColor: string;
}) => {
  return (
    <ParentDiv height={height}>
      <ChildDiv progress={progress} progressColor={progressColor}></ChildDiv>
    </ParentDiv>
  );
};

export default ProgressBar;
