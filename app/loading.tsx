"use client"
import Image from 'next/image'
import styled from 'styled-components'
const LoaderWrapper = styled.div`
  z-index: 1;
  height: 100vh;
  width: 100vw;
  position: absolute;
  background-color: #F9F9FA;
  display: flex;
  justify-content: center;
  align-items: center;

`
const Loading = () => (
  <LoaderWrapper>
    <Image src="/images/loader.gif" alt="Loading Spinner" width="64" height="64"/>
  </LoaderWrapper>
)

export default Loading