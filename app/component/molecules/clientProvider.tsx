'use client';
import AuthContextProvider from '../../../context/authContext';
import StyledComponentsRegistry from '../../../lib/registry';
import { ReactNode, Suspense } from 'react';
import styled from 'styled-components';
import { Outfit } from '@next/font/google';
import { Header } from './Header';
import { Footer } from './Footer';

// Load the font with specific options
const outfit = Outfit({
  weight: ['400', '500', '700'], // Specify font weights
  subsets: ['latin'], // Specify character subsets
});

const MainLayout = styled.div`
  background-color: #f1f0f5;
  margin-top: 80px;
  margin-bottom: 80px;
`;

const ClientProvider: React.FC<{ children: ReactNode; authToken: string }> = ({
  children,
  authToken,
}) => (
  <AuthContextProvider authToken={authToken}>
    <StyledComponentsRegistry>
      {/* <Suspense fallback={<Loading />}> */}
      <Header />
      {children}
      <Footer />
      {/* </Suspense> */}
    </StyledComponentsRegistry>
  </AuthContextProvider>
);

export default ClientProvider;
