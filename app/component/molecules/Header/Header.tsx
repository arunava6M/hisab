import styled from 'styled-components';
import Image from 'next/image';
import { Text } from '@atoms/Text';
import { useAuthContext } from '../../../../context/authContext';
import { capitalizeFirstLetter, getToken } from '@utils/helper';
import Cookies from 'js-cookie';

export const Header = () => {
  const { user } = useAuthContext();
  const authToken = Cookies.get('authToken');
  console.log('auth in header: ', authToken);
  if (!user?.firstName || !authToken) return null;
  return (
    <Wrapper>
      <ProfileImageWrapper>
        <Image src="images/avatar.png" width={40} height={40} alt="nav icon" />
      </ProfileImageWrapper>
      <Text>{`${capitalizeFirstLetter(user?.firstName)}'s finance tracker !`}</Text>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  position: fixed;
  // height: 60px;
  border-radius: 10px;
  // border-top-left-radius: 20px;
  // border-top-right-radius: 20px;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  margin: 10px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  // box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 7px 53px -11px rgba(0, 0, 0, 0.46);

  background-color: #f9f9fa;
`;

const ProfileImageWrapper = styled.div`
  background-color: #f1f0f5;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 1px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;
