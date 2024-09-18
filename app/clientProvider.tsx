'use client';
import AuthContextProvider from '../context/authContext';
import StyledComponentsRegistry from '../lib/registry';
import { Suspense } from 'react';
import Loading from './loading';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { Outfit } from '@next/font/google';
import { Text } from './component/atoms/Text';

// Load the font with specific options
const outfit = Outfit({
  weight: ['400', '500', '700'], // Specify font weights
  subsets: ['latin'], // Specify character subsets
});

const Footer = styled.footer`
  position: fixed;
  height: 60px;
  border-radius: 10px;
  // border-top-left-radius: 20px;
  // border-top-right-radius: 20px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  margin: 10px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  // box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 7px 53px -11px rgba(0, 0, 0, 0.46);

  background-color: #f9f9fa;
`;

const Header = styled.header`
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

const MainLayout = styled.body`
  background-color: #f1f0f5;
  margin-top: 80px;
  margin-bottom: 80px;
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

const ClientProvider = ({ children }) => {
  const navigations = [
    {
      icon: '/icon/message-dollar.svg',
      title: 'Home',
      link: '/',
    },
    {
      icon: '/icon/chart.svg',
      title: 'Details',
      link: '/details',
    },
    {
      icon: '/icon/logout.svg',
      title: 'Logout',
      link: '/details',
    },
    {
      icon: '/icon/settings.svg',
      title: 'Settings',
      link: '/details',
    },
  ];
  return (
    <AuthContextProvider>
      <StyledComponentsRegistry>
        <Suspense fallback={<Loading />}>
          <MainLayout className={outfit.className}>
            <Header>
              <ProfileImageWrapper>
                <Image
                  src="images/avatar.png"
                  width={40}
                  height={40}
                  alt="nav icon"
                />
              </ProfileImageWrapper>
              Vidhi&apos;s finance tracker !
            </Header>
            {children}
            <Footer>
              <Nav>
                {navigations.map((each, index) => (
                  <EachNavWrapper key={index}>
                    <Link href={each.link}>
                      <Image
                        src={each.icon}
                        width={15}
                        height={15}
                        alt="nav icon"
                      />
                    </Link>
                    <Text variant="light">{each.title}</Text>
                  </EachNavWrapper>
                ))}
              </Nav>
            </Footer>
          </MainLayout>
        </Suspense>
      </StyledComponentsRegistry>
    </AuthContextProvider>
  );
};

export default ClientProvider;
