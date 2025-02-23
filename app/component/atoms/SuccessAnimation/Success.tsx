import React from 'react';
import Lottie from 'lottie-react';
import successAnimation from './success.json';
import styled from 'styled-components';

const Div = styled.div`
  position: absolute;
  top: 50%;
  left: 31%;
`;

const SuccessAnimation = ({ onComplete }) => {
  return (
    <Div>
      <Lottie
        animationData={successAnimation}
        loop={false}
        onComplete={onComplete} // Trigger when the animation completes
        style={{ height: 150, width: 150 }}
      />
    </Div>
  );
};

export default SuccessAnimation;
