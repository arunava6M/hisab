import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { Text } from '../../atoms/Text';
import { useAuthContext } from '../../../../context/authContext';
import Cookies from 'js-cookie';

const Wrapper = styled.footer`
  position: fixed;
  height: 60px;
  border-radius: 10px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  margin: 10px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  box-shadow: 0px 7px 53px -11px rgba(0, 0, 0, 0.46);

  background-color: #f9f9fa;
`;
const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  width: 100%;
  color: grey;
`;
const EachNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const Footer = () => {
  const { user } = useAuthContext();
  if (!user?.firstName) return null;

  const navigations = [
    {
      icon: '/icon/message-dollar.svg',
      title: 'Home',
      link: '/dashboard',
    },
    {
      icon: '/icon/chart.svg',
      title: 'Details',
      link: '/details',
    },
    {
      icon: '/icon/logout.svg',
      title: 'Logout',
      link: '/signin',
      onClick: () => Cookies.remove('authToken'),
    },
    {
      icon: '/icon/settings.svg',
      title: 'Settings',
      link: '/details',
    },
  ];
  return (
    <Wrapper>
      <Nav>
        {navigations.map((each, index) => (
          <EachNavWrapper key={index}>
            <Link href={each.link} onClick={each.onClick}>
              <Image src={each.icon} width={15} height={15} alt="nav icon" />
            </Link>
            <Text variant="light">{each.title}</Text>
          </EachNavWrapper>
        ))}
      </Nav>
    </Wrapper>
  );
};
