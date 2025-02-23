'use client';
import AuthContextProvider, { useAuthContext } from '../context/authContext';
import StyledComponentsRegistry from '../lib/registry';
import { Suspense } from 'react';
import Loading from './loading';
import styled from 'styled-components';
import { Outfit } from '@next/font/google';
import { Header } from './component/molecules/Header';
import { Footer } from './component/molecules/Footer';

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

const ClientProvider = ({ children }) => (
  <AuthContextProvider>
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
